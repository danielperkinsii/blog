import { Block } from '../../lib/training'
import ChartFrame, { CHART_HEIGHT, linearScale, PAD_BOTTOM, PAD_LEFT, PAD_RIGHT, PAD_TOP, stepTicks, TimeAxis } from './chartFrame'

const SECONDS_PER_MINUTE = 60
const MINUTE_TICK_STEP = 5
const BAR_FILL_RATIO = 0.7
const MIN_LABEL_BAND_PX = 40

export default function SplitsChart({ blocks }: { blocks: Block[] }) {
  const races = blocks.filter((block) => block.splitDiffS !== null)
  if (!races.length) return <p className="text-sm text-gray-500">No lap data for these races.</p>
  const minutes = races.map((race) => (race.splitDiffS as number) / SECONDS_PER_MINUTE)
  const lowest = Math.floor((Math.min(0, ...minutes) - 1) / MINUTE_TICK_STEP) * MINUTE_TICK_STEP
  const highest = Math.ceil((Math.max(0, ...minutes) + 1) / MINUTE_TICK_STEP) * MINUTE_TICK_STEP

  return (
    <ChartFrame label="Second half minus first half for each marathon, in minutes">
      {({ width, showTip, hideTip }) => {
        const band = (width - PAD_LEFT - PAD_RIGHT) / races.length
        const barWidth = band * BAR_FILL_RATIO
        const y = linearScale(lowest, highest, CHART_HEIGHT - PAD_BOTTOM, PAD_TOP)
        const labelEvery = Math.ceil(MIN_LABEL_BAND_PX / band)
        const hasRoomForValues = band >= MIN_LABEL_BAND_PX
        return (
          <>
            <TimeAxis
              ticks={stepTicks(lowest, highest, MINUTE_TICK_STEP)}
              y={y}
              width={width}
              format={(tick) => `${tick} min`}
            />
            <line x1={PAD_LEFT} x2={width - PAD_RIGHT} y1={y(0)} y2={y(0)} className="stroke-gray-500" />
            {races.map((race, index) => {
              const value = minutes[index]
              const centerX = PAD_LEFT + band * (index + 0.5)
              const barTop = Math.min(y(0), y(value))
              const isLabelled = (races.length - 1 - index) % labelEvery === 0
              return (
                <g key={race.id}>
                  <rect
                    x={centerX - barWidth / 2}
                    y={barTop}
                    width={barWidth}
                    height={Math.abs(y(value) - y(0))}
                    rx={2}
                    className={value <= 0 ? 'fill-blue-500' : 'fill-gray-300'}
                  />
                  {hasRoomForValues && (
                    <text
                      x={centerX}
                      y={y(value) + (value < 0 ? 14 : -6)}
                      textAnchor="middle"
                      className="fill-gray-900 text-xs"
                    >
                      {race.splitDiff}
                    </text>
                  )}
                  {isLabelled && (
                    <text x={centerX} y={CHART_HEIGHT - 8} textAnchor="middle" className="fill-gray-500 text-xs">
                      {Number(race.date.slice(5, 7))}/{race.date.slice(2, 4)}
                    </text>
                  )}
                  <rect
                    x={centerX - band / 2}
                    y={PAD_TOP}
                    width={band}
                    height={CHART_HEIGHT - PAD_TOP - PAD_BOTTOM}
                    fill="transparent"
                    onPointerMove={(event) =>
                      showTip(event, [
                        race.race,
                        `${race.dateDisplay} · ${race.finish}`,
                        `First half ${race.firstHalf}`,
                        `Second half ${race.secondHalf}`,
                        `Change ${race.splitDiff}`,
                      ])
                    }
                    onPointerLeave={hideTip}
                  />
                </g>
              )
            })}
          </>
        )
      }}
    </ChartFrame>
  )
}
