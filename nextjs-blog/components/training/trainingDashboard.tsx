import React, { useState } from 'react'
import { BLOCK_WEEKS, formatSigned, LONG_RUN_MILES, MetricKey, METRICS, TrainingData } from '../../lib/training'
import BlocksTable from './blocksTable'
import FinishTimesChart from './finishTimesChart'
import ScatterChart from './scatterChart'
import SignalsChart from './signalsChart'
import SplitsChart from './splitsChart'
import StatTile from './statTile'
import WeeklyMilesChart from './weeklyMilesChart'

const SELECT_CLASS = 'max-w-full border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900'

function Section({
  title,
  description,
  control,
  children,
}: {
  title: string
  description: string
  control?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="min-w-0 border border-gray-200 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="!m-0 text-xl font-bold text-gray-900">{title}</h2>
        {control}
      </div>
      <p className="mb-3 max-w-2xl text-sm text-gray-600">{description}</p>
      {children}
    </section>
  )
}

export default function TrainingDashboard({ data }: { data: TrainingData }) {
  const { blocks, correlations } = data
  const withBlock = blocks.filter((block) => block.hasBlock)
  const latest = blocks[blocks.length - 1]
  const fastest = blocks.reduce((a, b) => (b.finishS < a.finishS ? b : a))
  const latestBlock = withBlock[withBlock.length - 1]
  const previousBlock = withBlock[withBlock.length - 2]
  const fastestBlock = withBlock.length ? withBlock.reduce((a, b) => (b.finishS < a.finishS ? b : a)) : undefined
  const topSignal = correlations.length
    ? correlations.reduce((a, b) => (Math.abs(b.r) > Math.abs(a.r) ? b : a))
    : undefined

  const [pickedRaceId, setPickedRaceId] = useState(latestBlock?.id ?? '')
  const [metric, setMetric] = useState<MetricKey>('avgWk')

  const gapToFastest = formatSigned(latest.finishS - fastest.finishS)
  const milesChange =
    latestBlock && previousBlock ? (latestBlock.avgWk as number) - (previousBlock.avgWk as number) : null
  const milesChangeText =
    milesChange === null
      ? 'First block with run history'
      : `${milesChange >= 0 ? '+' : ''}${milesChange.toFixed(1)} mi/week vs the block before it`
  const updatedOn = new Date(data.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <div className="space-y-6">
      <p className="text-md max-w-2xl text-gray-900">
        {latest.id === fastest.id ? (
          <>
            My latest marathon, <b>{latest.race}</b>, is my fastest yet at <b>{latest.finish}</b>.
          </>
        ) : (
          <>
            My latest marathon, <b>{latest.race}</b>, finished in <b>{latest.finish}</b>, <b>{gapToFastest}</b> off my
            best of <b>{fastest.finish}</b> at <b>{fastest.race}</b>.
          </>
        )}
        {latestBlock && fastestBlock && (
          <>
            {' '}
            The latest block averaged <b>{latestBlock.avgWk?.toFixed(1)}</b> miles a week; the block before my fastest
            race averaged <b>{fastestBlock.avgWk?.toFixed(1)}</b>.
          </>
        )}
        {topSignal && (
          <>
            {' '}
            Across blocks, the number most tied to finish time so far is <b>{topSignal.label.toLowerCase()}</b> (r ={' '}
            <b>{topSignal.r.toFixed(2)}</b>).
          </>
        )}
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Fastest marathon" value={fastest.finish} detail={`${fastest.race} · ${fastest.dateDisplay}`} />
        <StatTile
          label="Latest marathon"
          value={latest.finish}
          detail={`${gapToFastest} vs fastest · ${latest.dateDisplay}`}
        />
        <StatTile
          label="Latest block, miles per week"
          value={latestBlock?.avgWk?.toFixed(1) ?? '—'}
          detail={milesChangeText}
        />
        <StatTile label="Marathons on Strava" value={String(blocks.length)} detail={`${data.sub3Count} under 3 hours`} />
      </div>

      <Section
        title="Finish times, race by race"
        description="Each dot is a marathon; higher is faster. Filled dots set a new personal best at the time. Finish time is Strava's elapsed time, which can differ from chip time by a few seconds."
      >
        <FinishTimesChart blocks={blocks} />
      </Section>

      {fastestBlock && (
        <Section
          title={`Weekly miles in the ${BLOCK_WEEKS} weeks before each race`}
          description="Every block is a grey line, read left to right toward race day. The race you pick is highlighted beside the block before my fastest marathon. A block that starts soon after another marathon includes that race and its recovery."
          control={
            <select
              aria-label="Race to highlight"
              className={SELECT_CLASS}
              value={pickedRaceId}
              onChange={(event) => setPickedRaceId(event.target.value)}
            >
              {withBlock
                .slice()
                .reverse()
                .map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.date.slice(0, 4)} · {block.race}
                  </option>
                ))}
            </select>
          }
        >
          <WeeklyMilesChart blocks={withBlock} pickedId={pickedRaceId} fastestId={fastestBlock.id} />
        </Section>
      )}

      <Section
        title="Second half against first half"
        description="Minutes the second half took beyond the first, race by race in date order. A bar above the line means I slowed; below it is a negative split. Halves are measured from each race's laps on Strava, so they follow GPS distance."
      >
        <SplitsChart blocks={blocks} />
      </Section>

      {correlations.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Section
            title="What moved with faster races"
            description="Correlation between each block number and finish time. A bar to the left means more of it went with faster finishes; to the right, with slower ones. With this few races it is a hint, not proof. Pick a bar to plot it."
          >
            <SignalsChart correlations={correlations} metric={metric} onPick={setMetric} />
          </Section>
          <Section
            title="Block number against finish time"
            description="One dot per block, with the chosen number across and finish time up; higher is faster."
            control={
              <select
                aria-label="Block number to plot"
                className={SELECT_CLASS}
                value={metric}
                onChange={(event) => setMetric(event.target.value as MetricKey)}
              >
                {METRICS.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            }
          >
            <ScatterChart blocks={blocks} metric={metric} />
          </Section>
        </div>
      )}

      <Section
        title="Every race and its block"
        description="Newest first. A dash means Strava has no run history or laps for that race."
      >
        <BlocksTable blocks={blocks} />
      </Section>

      <details className="text-sm text-gray-600">
        <summary className="cursor-pointer">How these numbers are worked out</summary>
        <p className="max-w-2xl">
          A marathon is any run on Strava between 41 and 43.5 km. A block is the {BLOCK_WEEKS} weeks before race day,
          not counting the race. Miles per week is the block&apos;s total divided by its weeks. A long run is{' '}
          {LONG_RUN_MILES} miles or more. Training pace is total moving time over total miles. Taper is the average of
          the final two weeks as a percent of the average of the weeks before them. Pace per mile uses the full
          marathon distance, not the GPS distance. The first half ends where the race&apos;s laps reach half of their
          total distance; split change is the second half minus the first.
        </p>
        <p>Data from Strava, updated {updatedOn}.</p>
      </details>
    </div>
  )
}
