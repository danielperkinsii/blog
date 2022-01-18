import { parseISO, format } from 'date-fns'

export default function Date({ dateString }: { dateString: string }) {
  const date: Date = parseISO(dateString)
  if (date && dateString){
    return <time className="text-gray-700" dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
  } else {
    console.log('Date not parsed', 'date: ', date, 'dateString', dateString)
  }
  return null
}