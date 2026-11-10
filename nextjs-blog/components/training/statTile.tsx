export default function StatTile({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0 border border-gray-200 bg-white p-4">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="my-1 text-3xl tabular-nums text-gray-900">{value}</div>
      <div className="break-words text-xs text-gray-600">{detail}</div>
    </div>
  )
}
