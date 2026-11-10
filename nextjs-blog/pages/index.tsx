import Head from 'next/head'
import { GetStaticProps } from 'next'
import TrainingDashboard from '../components/training/trainingDashboard'
import { FAVICON_HREF } from '../lib/site'
import { getTrainingData, hasStravaCredentials } from '../lib/strava'
import { TrainingData } from '../lib/training'

const REVALIDATE_SECONDS = 60 * 60 * 24
const RETRY_SECONDS = 60 * 5
const PAGE_TITLE = 'Daniel Perkins · Marathon training blocks'
const PAGE_DESCRIPTION = 'Every marathon I have run, the training block behind it, and what tracked with the fast ones.'

// The daily rebuild pages through the whole Strava history, which can outlast Vercel's default function limit.
export const config = { maxDuration: 60 }

export default function Home({ data }: { data: TrainingData | null }) {
  const hasRaces = data !== null && data.blocks.length > 0
  return (
    <div className="flex flex-col items-center p-4">
      <Head>
        <title>{PAGE_TITLE}</title>
        <link rel="icon" href={FAVICON_HREF} />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="og:title" content={PAGE_TITLE} />
      </Head>
      <main className="mx-auto w-full max-w-4xl py-8 sm:px-4">
        <h1 className="mb-2 text-center text-4xl font-bold text-gray-900">Marathon Training Blocks</h1>
        <p className="mx-auto mb-8 max-w-2xl text-center text-gray-900">
          Every marathon I&apos;ve run, the training block behind it, and what tracked with the fast ones.
        </p>
        {hasRaces ? (
          <TrainingDashboard data={data as TrainingData} />
        ) : (
          <p className="text-center text-gray-600">Training data is unavailable right now. Check back soon.</p>
        )}
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps<{ data: TrainingData | null }> = async () => {
  if (!hasStravaCredentials()) return { props: { data: null }, revalidate: RETRY_SECONDS }
  // A Strava failure throws on purpose: a build fails and the last deploy stays live, and a revalidation keeps the last good page.
  const data = await getTrainingData()
  return { props: { data }, revalidate: REVALIDATE_SECONDS }
}
