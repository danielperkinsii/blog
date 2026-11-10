import { Block } from '../../lib/training'

const COLUMNS: { label: string; isText?: boolean; value: (block: Block) => string | number | null }[] = [
  { label: 'Date', isText: true, value: (b) => b.dateDisplay },
  { label: 'Race', isText: true, value: (b) => b.race },
  { label: 'Finish', value: (b) => b.finish },
  { label: 'Pace /mi', value: (b) => b.pace },
  { label: 'First half', value: (b) => b.firstHalf },
  { label: 'Second half', value: (b) => b.secondHalf },
  { label: 'Split change', value: (b) => b.splitDiff },
  { label: 'Mi/week', value: (b) => b.avgWk?.toFixed(1) ?? null },
  { label: 'Peak week', value: (b) => b.peakWk?.toFixed(1) ?? null },
  { label: 'Long runs', value: (b) => b.longRuns },
  { label: 'Longest', value: (b) => b.longest?.toFixed(1) ?? null },
  { label: 'Runs/week', value: (b) => b.runsWk?.toFixed(1) ?? null },
  { label: 'Training pace', value: (b) => b.trainPace },
  { label: 'Taper %', value: (b) => b.taperPct },
  { label: 'Days since last', value: (b) => b.daysSincePrev },
]

export default function BlocksTable({ blocks }: { blocks: Block[] }) {
  const newestFirst = blocks.slice().reverse()
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs tabular-nums">
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column.label}
                className={`whitespace-nowrap border-b border-gray-200 p-2 font-semibold text-gray-600 ${
                  column.isText ? 'text-left' : 'text-right'
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {newestFirst.map((block) => (
            <tr key={block.id}>
              {COLUMNS.map((column) => (
                <td
                  key={column.label}
                  className={`max-w-[220px] truncate whitespace-nowrap border-b border-gray-200 p-2 text-gray-900 ${
                    column.isText ? 'text-left' : 'text-right'
                  }`}
                >
                  {column.value(block) ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
