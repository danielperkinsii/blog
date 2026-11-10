import { Correlation, MetricKey } from '../../lib/training'
import ChartFrame, { linearScale } from './chartFrame'

const ROW_HEIGHT = 40
const LABEL_HEIGHT = 18
const BAR_HEIGHT = 14
const AXIS_HEIGHT = 28
const VALUE_GUTTER = 40
const NARROW_PX = 360

export default function SignalsChart({
  correlations,
  metric,
  onPick,
}: {
  correlations: Correlation[]
  metric: MetricKey
  onPick: (key: MetricKey) => void
}) {
  const rows = correlations.slice().sort((a, b) => a.r - b.r)
  const barsHeight = rows.length * ROW_HEIGHT

  return (
    <ChartFrame height={barsHeight + AXIS_HEIGHT} label="Correlation of each block number with finish time">
      {({ width, showTip, hideTip }) => {
        const x = linearScale(-1, 1, VALUE_GUTTER, width - VALUE_GUTTER)
        const ticks = width < NARROW_PX ? [-1, 0, 1] : [-1, -0.5, 0, 0.5, 1]
        return (
          <>
            {ticks.map((tick) => (
              <text key={tick} x={x(tick)} y={barsHeight + 18} textAnchor="middle" className="fill-gray-500 text-xs">
                {tick.toFixed(1)}
              </text>
            ))}
            <line x1={x(0)} x2={x(0)} y1={0} y2={barsHeight} className="stroke-gray-400" />
            {rows.map((row, index) => {
              const top = index * ROW_HEIGHT
              const isNegative = row.r < 0
              return (
                <g key={row.key}>
                  <text x={0} y={top + LABEL_HEIGHT - 6} className="fill-gray-600 text-xs">
                    {row.label}
                  </text>
                  <rect
                    x={Math.min(x(0), x(row.r))}
                    y={top + LABEL_HEIGHT}
                    width={Math.abs(x(row.r) - x(0))}
                    height={BAR_HEIGHT}
                    rx={2}
                    className={row.key === metric ? 'fill-blue-500' : 'fill-gray-300'}
                  />
                  <text
                    x={x(row.r) + (isNegative ? -6 : 6)}
                    y={top + LABEL_HEIGHT + BAR_HEIGHT / 2}
                    dy="0.35em"
                    textAnchor={isNegative ? 'end' : 'start'}
                    className="fill-gray-900 text-xs"
                  >
                    {row.r.toFixed(2)}
                  </text>
                  <rect
                    x={0}
                    y={top}
                    width={width}
                    height={ROW_HEIGHT}
                    fill="transparent"
                    className="cursor-pointer"
                    onClick={() => onPick(row.key)}
                    onPointerMove={(event) =>
                      showTip(event, [
                        row.label,
                        `r = ${row.r.toFixed(2)} across ${row.n} blocks`,
                        isNegative ? 'More went with faster finishes' : 'More went with slower finishes',
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
