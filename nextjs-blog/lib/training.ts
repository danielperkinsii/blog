export const BLOCK_WEEKS = 16
export const LONG_RUN_MILES = 18

const TAPER_WEEKS = 2
const MARATHON_MILES = 26.2188
const MARATHON_MIN_METERS = 41000
const MARATHON_MAX_METERS = 43500
const METERS_PER_MILE = 1609.344
const SECONDS_PER_DAY = 86400
const SUB_3_SECONDS = 3 * 3600
const MIN_LAPS_FOR_SPLITS = 10
const LAPS_MIN_METERS = 40000
const LAPS_MAX_METERS = 44500
const MIN_BLOCKS_FOR_CORRELATION = 4
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export interface RunActivity {
  id: string
  name: string
  date: string
  meters: number
  movingSeconds: number
  elapsedSeconds: number
}

export interface RaceLap {
  meters: number
  elapsedSeconds: number
}

export type MetricKey =
  | 'avgWk'
  | 'peakWk'
  | 'longRuns'
  | 'longest'
  | 'runsWk'
  | 'trainPaceS'
  | 'taperPct'
  | 'daysSincePrev'

export const METRICS: { key: MetricKey; label: string }[] = [
  { key: 'avgWk', label: 'Miles per week' },
  { key: 'peakWk', label: 'Peak week miles' },
  { key: 'longRuns', label: 'Long runs' },
  { key: 'longest', label: 'Longest run (mi)' },
  { key: 'runsWk', label: 'Runs per week' },
  { key: 'trainPaceS', label: 'Average training pace' },
  { key: 'taperPct', label: 'Taper (% of earlier weeks)' },
  { key: 'daysSincePrev', label: 'Days since previous marathon' },
]

export interface Block {
  id: string
  date: string
  dateDisplay: string
  race: string
  finishS: number
  finish: string
  pace: string
  isPr: boolean
  daysSincePrev: number | null
  hasBlock: boolean
  avgWk: number | null
  peakWk: number | null
  longRuns: number | null
  longest: number | null
  runsWk: number | null
  trainPaceS: number | null
  trainPace: string | null
  taperPct: number | null
  // Index 0 is the week ending the day before the race.
  weeklyMiles: number[] | null
  firstHalf: string | null
  secondHalf: string | null
  splitDiffS: number | null
  splitDiff: string | null
}

export interface Correlation {
  key: MetricKey
  label: string
  r: number
  n: number
}

export interface TrainingData {
  updatedAt: string
  blocks: Block[]
  correlations: Correlation[]
  sub3Count: number
}

const pad = (n: number) => String(n).padStart(2, '0')
const round1 = (x: number) => Math.round(x * 10) / 10
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
const mean = (xs: number[]) => sum(xs) / xs.length

export const dayNumber = (date: string) =>
  Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10))) / (SECONDS_PER_DAY * 1000)

export function formatClock(seconds: number) {
  const s = Math.round(seconds)
  return `${Math.floor(s / 3600)}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

export function formatMinSec(seconds: number) {
  const s = Math.round(seconds)
  return `${Math.floor(s / 60)}:${pad(s % 60)}`
}

export function formatHourMin(seconds: number) {
  const s = Math.round(seconds)
  return `${Math.floor(s / 3600)}:${pad(Math.floor((s % 3600) / 60))}`
}

export function formatSigned(seconds: number) {
  const sign = seconds < 0 ? '-' : '+'
  return sign + formatMinSec(Math.abs(seconds))
}

function formatDate(date: string) {
  return `${MONTHS[Number(date.slice(5, 7)) - 1]} ${Number(date.slice(8, 10))}, ${date.slice(0, 4)}`
}

function halfSplits(laps: RaceLap[]) {
  const meters = sum(laps.map((lap) => lap.meters))
  const hasUsableLaps =
    laps.length >= MIN_LAPS_FOR_SPLITS && meters >= LAPS_MIN_METERS && meters <= LAPS_MAX_METERS
  if (!hasUsableLaps) return null
  const halfway = meters / 2
  let covered = 0
  let firstHalfS = 0
  for (let i = 0; i < laps.length; i++) {
    const lap = laps[i]
    if (covered + lap.meters >= halfway) {
      firstHalfS += lap.elapsedSeconds * ((halfway - covered) / lap.meters)
      break
    }
    covered += lap.meters
    firstHalfS += lap.elapsedSeconds
  }
  const first = Math.round(firstHalfS)
  const second = Math.round(sum(laps.map((lap) => lap.elapsedSeconds)) - firstHalfS)
  return { first, second }
}

function pearson(pairs: [number, number][]) {
  const n = pairs.length
  const meanX = mean(pairs.map((p) => p[0]))
  const meanY = mean(pairs.map((p) => p[1]))
  const sxy = sum(pairs.map((p) => (p[0] - meanX) * (p[1] - meanY)))
  const sxx = sum(pairs.map((p) => (p[0] - meanX) ** 2))
  const syy = sum(pairs.map((p) => (p[1] - meanY) ** 2))
  if (sxx === 0 || syy === 0) return null
  return Math.round((100 * sxy) / Math.sqrt(sxx * syy)) / 100
}

export function isMarathon(run: RunActivity) {
  return run.meters >= MARATHON_MIN_METERS && run.meters <= MARATHON_MAX_METERS
}

export function buildTrainingData(
  runs: RunActivity[],
  lapsByRaceId: Record<string, RaceLap[]>,
  updatedAt: string,
): TrainingData {
  const dated = runs.map((run) => ({ ...run, day: dayNumber(run.date), miles: run.meters / METERS_PER_MILE }))
  const firstDay = Math.min(...dated.map((run) => run.day))
  const marathons = dated.filter(isMarathon).sort((a, b) => a.day - b.day)

  let bestSoFar = Infinity
  let previousRaceDay: number | null = null

  const blocks: Block[] = marathons.map((race) => {
    const isPr = race.elapsedSeconds < bestSoFar
    bestSoFar = Math.min(bestSoFar, race.elapsedSeconds)
    const daysSincePrev = previousRaceDay === null ? null : race.day - previousRaceDay
    previousRaceDay = race.day

    const splits = halfSplits(lapsByRaceId[race.id] || [])
    const splitDiffS = splits ? splits.second - splits.first : null

    const blockDays = BLOCK_WEEKS * 7
    const inBlock = dated.filter((run) => race.day - run.day >= 1 && race.day - run.day <= blockDays)
    const hasBlock = inBlock.length > 0 && firstDay <= race.day - blockDays

    const weeklyMiles = Array(BLOCK_WEEKS).fill(0) as number[]
    inBlock.forEach((run) => {
      weeklyMiles[Math.ceil((race.day - run.day) / 7) - 1] += run.miles
    })
    const miles = sum(inBlock.map((run) => run.miles))
    const movingSeconds = sum(inBlock.map((run) => run.movingSeconds))
    const earlierWeeksAvg = mean(weeklyMiles.slice(TAPER_WEEKS))
    const taperWeeksAvg = mean(weeklyMiles.slice(0, TAPER_WEEKS))
    const trainPaceS = miles > 0 ? Math.round(movingSeconds / miles) : null

    return {
      id: race.id,
      date: race.date,
      dateDisplay: formatDate(race.date),
      race: race.name,
      finishS: race.elapsedSeconds,
      finish: formatClock(race.elapsedSeconds),
      pace: formatMinSec(race.elapsedSeconds / MARATHON_MILES),
      isPr,
      daysSincePrev,
      hasBlock,
      avgWk: hasBlock ? round1(miles / BLOCK_WEEKS) : null,
      peakWk: hasBlock ? round1(Math.max(...weeklyMiles)) : null,
      longRuns: hasBlock ? inBlock.filter((run) => run.miles >= LONG_RUN_MILES).length : null,
      longest: hasBlock ? round1(Math.max(...inBlock.map((run) => run.miles))) : null,
      runsWk: hasBlock ? round1(inBlock.length / BLOCK_WEEKS) : null,
      trainPaceS: hasBlock ? trainPaceS : null,
      trainPace: hasBlock && trainPaceS !== null ? formatMinSec(trainPaceS) : null,
      taperPct: hasBlock && earlierWeeksAvg > 0 ? Math.round((100 * taperWeeksAvg) / earlierWeeksAvg) : null,
      weeklyMiles: hasBlock ? weeklyMiles.map(round1) : null,
      firstHalf: splits ? formatClock(splits.first) : null,
      secondHalf: splits ? formatClock(splits.second) : null,
      splitDiffS,
      splitDiff: splitDiffS === null ? null : formatSigned(splitDiffS),
    }
  })

  const withBlock = blocks.filter((block) => block.hasBlock)
  const correlations: Correlation[] = []
  METRICS.forEach(({ key, label }) => {
    const pairs = withBlock
      .filter((block) => block[key] !== null)
      .map((block) => [block[key] as number, block.finishS] as [number, number])
    if (pairs.length < MIN_BLOCKS_FOR_CORRELATION) return
    const r = pearson(pairs)
    if (r !== null) correlations.push({ key, label, r, n: pairs.length })
  })

  return {
    updatedAt,
    blocks,
    correlations,
    sub3Count: blocks.filter((block) => block.finishS < SUB_3_SECONDS).length,
  }
}
