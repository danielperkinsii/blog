import { Block, dayNumber, formatHourMin } from '../../lib/training'
import ChartFrame, { CHART_HEIGHT, linearScale, PAD_BOTTOM, PAD_LEFT, PAD_RIGHT, PAD_TOP, stepTicks, TimeAxis } from './chartFrame'

const TEN_MINUTES_S = 600
const DAY_PADDING = 90
const DOT_RADIUS = 5
const HIT_RADIUS = 14
const MIN_YEAR_LABEL_PX = 48

export default function FinishTimesChart({ blocks }: { blocks: Block[] }) {
  const points = blocks.map((block) => ({ ...block, day: dayNumber(block.date) }))
  const fastest = points.reduce((a, b) => (b.finishS < a.finishS ? b : a))
  const latest = points[points.length - 1]
  const labelled = fastest.id === latest.id ? [fastest] : [fastest, latest]
  const minS = fastest.finishS - TEN_MINUTES_S / 2
  const maxS = Math.max(...points.map((p) => p.finishS)) + TEN_MINUTES_S / 2
  const firstDay = points[0].day - DAY_PADDING
  const lastDay = latest.day + DAY_PADDING
  const firstYear = Number(points[0].date.slice(0, 4))
  const lastYear = Number(latest.date.slice(0, 4))

  return (
    <ChartFrame label="Marathon finish times over the years; higher is faster">
      {({ width, showTip, hideTip }) => {
        const x = linearScale(firstDay, lastDay, PAD_LEFT, width - PAD_RIGHT)
        const y = linearScale(minS, maxS, PAD_TOP, CHART_HEIGHT - PAD_BOTTOM)
        const yearCount = lastYear - firstYear + 1
        const yearStep = Math.max(1, Math.ceil((yearCount * MIN_YEAR_LABEL_PX) / (width - PAD_LEFT - PAD_RIGHT)))
        const years = stepTicks(firstYear, lastYear, 1).filter((year) => (lastYear - year) % yearStep === 0)
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.day)},${y(p.finishS)}`).join('')
        return (
          <>
            <TimeAxis ticks={stepTicks(minS, maxS, TEN_MINUTES_S)} y={y} width={width} format={formatHourMin} />
            {years.map((year) => (
              <text
                key={year}
                x={x(dayNumber(`${year}-07-01`))}
                y={CHART_HEIGHT - 8}
                textAnchor="middle"
                className="fill-gray-500 text-xs"
              >
                {year}
              </text>
            ))}
            <path d={path} fill="none" strokeWidth={1.5} className="stroke-gray-300" />
            {points.map((p) => (
              <circle
                key={p.id}
                cx={x(p.day)}
                cy={y(p.finishS)}
                r={DOT_RADIUS}
                strokeWidth={2}
                className={p.isPr ? 'fill-blue-500 stroke-blue-500' : 'fill-white stroke-gray-400'}
              />
            ))}
            {labelled.map((p) => (
              <text
                key={p.id}
                x={x(p.day)}
                y={y(p.finishS) - 10}
                textAnchor={x(p.day) > width - 70 ? 'end' : 'middle'}
                className="fill-gray-900 text-xs"
              >
                {p.finish}
              </text>
            ))}
            {points.map((p) => (
              <circle
                key={p.id}
                cx={x(p.day)}
                cy={y(p.finishS)}
                r={HIT_RADIUS}
                fill="transparent"
                onPointerMove={(event) =>
                  showTip(event, [
                    p.race,
                    p.dateDisplay,
                    `${p.finish} · ${p.pace} /mi`,
                    p.isPr ? 'Personal best at the time' : '',
                  ])
                }
                onPointerLeave={hideTip}
              />
            ))}
          </>
        )
      }}
    </ChartFrame>
  )
}
