import { Block } from '../../lib/training'
import ChartFrame, { CHART_HEIGHT, linearScale, PAD_BOTTOM, PAD_LEFT, PAD_RIGHT, PAD_TOP, stepTicks, TimeAxis } from './chartFrame'

const MILES_TICK_STEP = 20
const DOT_RADIUS = 3
const HIT_RADIUS = 11
const NARROW_PX = 420
const MEDIUM_PX = 640

type Tone = 'picked' | 'fastest' | 'other'

const LINE_CLASS: Record<Tone, string> = {
  picked: 'stroke-blue-500',
  fastest: 'stroke-orange-500',
  other: 'stroke-gray-300',
}
const DOT_CLASS: Record<Tone, string> = {
  picked: 'fill-blue-500',
  fastest: 'fill-orange-500',
  other: 'fill-gray-300',
}
const SWATCH_CLASS: Record<Tone, string> = {
  picked: 'bg-blue-500',
  fastest: 'bg-orange-500',
  other: 'bg-gray-300',
}

export default function WeeklyMilesChart({
  blocks,
  pickedId,
  fastestId,
}: {
  blocks: Block[]
  pickedId: string
  fastestId: string
}) {
  const toneOf = (id: string): Tone => (id === pickedId ? 'picked' : id === fastestId ? 'fastest' : 'other')
  const series = blocks
    .filter((block) => block.weeklyMiles)
    .map((block) => ({ block, tone: toneOf(block.id), weeks: block.weeklyMiles as number[] }))
  const drawOrder: Tone[] = ['other', 'fastest', 'picked']
  const ordered = series.slice().sort((a, b) => drawOrder.indexOf(a.tone) - drawOrder.indexOf(b.tone))
  const highlighted = ordered.filter((s) => s.tone !== 'other')
  const weekCount = Math.max(...series.map((s) => s.weeks.length))
  const maxMiles = Math.max(...series.map((s) => Math.max(...s.weeks)))
  const topMiles = Math.ceil(maxMiles / MILES_TICK_STEP) * MILES_TICK_STEP

  return (
    <div>
      <ChartFrame label="Weekly miles in the weeks before each marathon">
        {({ width, showTip, hideTip }) => {
          const x = linearScale(weekCount, 1, PAD_LEFT + 8, width - PAD_RIGHT)
          const y = linearScale(0, topMiles, CHART_HEIGHT - PAD_BOTTOM, PAD_TOP)
          const weekStep = width < NARROW_PX ? 4 : width < MEDIUM_PX ? 2 : 1
          const weekTicks = stepTicks(1, weekCount, 1).filter((week) => (weekCount - week) % weekStep === 0)
          return (
            <>
              <TimeAxis ticks={stepTicks(0, topMiles, MILES_TICK_STEP)} y={y} width={width} format={String} />
              {weekTicks.map((week) => (
                <text key={week} x={x(week)} y={CHART_HEIGHT - 8} textAnchor="middle" className="fill-gray-500 text-xs">
                  {week} wk
                </text>
              ))}
              {ordered.map(({ block, tone, weeks }) => (
                <path
                  key={block.id}
                  d={weeks.map((miles, i) => `${i === 0 ? 'M' : 'L'}${x(i + 1)},${y(miles)}`).join('')}
                  fill="none"
                  strokeWidth={tone === 'other' ? 1 : 2.5}
                  className={LINE_CLASS[tone]}
                />
              ))}
              {highlighted.map(({ block, tone, weeks }) =>
                weeks.map((miles, i) => (
                  <g key={`${block.id}-${i}`}>
                    <circle cx={x(i + 1)} cy={y(miles)} r={DOT_RADIUS} className={DOT_CLASS[tone]} />
                    <circle
                      cx={x(i + 1)}
                      cy={y(miles)}
                      r={HIT_RADIUS}
                      fill="transparent"
                      onPointerMove={(event) =>
                        showTip(event, [
                          block.race,
                          `${i + 1} ${i === 0 ? 'week' : 'weeks'} out`,
                          `${miles.toFixed(1)} mi`,
                        ])
                      }
                      onPointerLeave={hideTip}
                    />
                  </g>
                )),
              )}
            </>
          )
        }}
      </ChartFrame>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600">
        {highlighted
          .slice()
          .reverse()
          .map(({ block, tone }) => (
            <span key={block.id}>
              <i className={`mr-2 inline-block h-1 w-3 rounded align-middle ${SWATCH_CLASS[tone]}`} />
              {block.date.slice(0, 4)} · {block.race} · {block.finish} · {(block.avgWk ?? 0).toFixed(1)} mi/week
              {block.id === fastestId ? ' (fastest)' : ''}
            </span>
          ))}
      </div>
    </div>
  )
}
