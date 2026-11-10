import { Block, formatHourMin, formatMinSec, MetricKey } from '../../lib/training'
import ChartFrame, { CHART_HEIGHT, linearScale, PAD_BOTTOM, PAD_LEFT, PAD_RIGHT, PAD_TOP, stepTicks, TimeAxis } from './chartFrame'

const TEN_MINUTES_S = 600
const DOT_RADIUS = 6
const HIT_RADIUS = 14
const X_PADDING_RATIO = 0.08
const X_TICK_COUNT = 4
const EDGE_PX = 60

export default function ScatterChart({ blocks, metric }: { blocks: Block[]; metric: MetricKey }) {
  const points = blocks.filter((block) => block.hasBlock && block[metric] !== null)
  if (!points.length) return <p className="text-sm text-gray-500">Not enough blocks to plot.</p>
  const valueOf = (block: Block) => block[metric] as number
  const formatValue = (value: number) =>
    metric === 'trainPaceS' ? formatMinSec(value) : String(Math.round(value * 10) / 10)
  const latest = points[points.length - 1]
  const fastest = points.reduce((a, b) => (b.finishS < a.finishS ? b : a))
  const named =
    fastest.id === latest.id
      ? [{ block: latest, text: 'Latest and fastest' }]
      : [
          { block: latest, text: 'Latest' },
          { block: fastest, text: 'Fastest' },
        ]
  const minS = fastest.finishS - TEN_MINUTES_S / 2
  const maxS = Math.max(...points.map((p) => p.finishS)) + TEN_MINUTES_S / 2
  const minValue = Math.min(...points.map(valueOf))
  const maxValue = Math.max(...points.map(valueOf))
  const padding = (maxValue - minValue || 1) * X_PADDING_RATIO
  const isWholeNumberMetric = points.every((p) => Number.isInteger(valueOf(p)))
  const evenTicks = Array.from(
    { length: X_TICK_COUNT },
    (_, i) => minValue + ((maxValue - minValue) * i) / (X_TICK_COUNT - 1),
  )
  const roundedTicks = evenTicks.map(Math.round).filter((tick, i, all) => all.indexOf(tick) === i)
  const xTicks = isWholeNumberMetric ? roundedTicks : evenTicks
  const dotClass = (block: Block) =>
    block.id === latest.id ? 'fill-blue-500' : block.id === fastest.id ? 'fill-orange-500' : 'fill-gray-400'

  return (
    <ChartFrame label="Finish time against the chosen block number; higher is faster">
      {({ width, tipHandlers }) => {
        const x = linearScale(minValue - padding, maxValue + padding, PAD_LEFT, width - PAD_RIGHT)
        const y = linearScale(minS, maxS, PAD_TOP, CHART_HEIGHT - PAD_BOTTOM)
        const anchorOf = (px: number) => (px > width - EDGE_PX ? 'end' : px < PAD_LEFT + EDGE_PX ? 'start' : 'middle')
        return (
          <>
            <TimeAxis ticks={stepTicks(minS, maxS, TEN_MINUTES_S)} y={y} width={width} format={formatHourMin} />
            {(maxValue > minValue ? xTicks : [minValue]).map((tick) => (
              <text key={tick} x={x(tick)} y={CHART_HEIGHT - 8} textAnchor="middle" className="fill-gray-500 text-xs">
                {formatValue(tick)}
              </text>
            ))}
            {points.map((p) => (
              <circle key={p.id} cx={x(valueOf(p))} cy={y(p.finishS)} r={DOT_RADIUS} className={dotClass(p)} />
            ))}
            {named.map(({ block, text }) => (
              <text
                key={text}
                x={x(valueOf(block))}
                y={y(block.finishS) - 11}
                textAnchor={anchorOf(x(valueOf(block)))}
                className="fill-gray-900 text-xs"
              >
                {text}
              </text>
            ))}
            {points.map((p) => (
              <circle
                key={p.id}
                cx={x(valueOf(p))}
                cy={y(p.finishS)}
                r={HIT_RADIUS}
                fill="transparent"
                {...tipHandlers([p.race, p.dateDisplay, `Finish ${p.finish}`, `Block: ${formatValue(valueOf(p))}`])}
              />
            ))}
          </>
        )
      }}
    </ChartFrame>
  )
}
