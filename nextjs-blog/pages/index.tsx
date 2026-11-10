import Head from 'next/head'
import { GetStaticProps } from 'next'
import TrainingDashboard from '../components/training/trainingDashboard'
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
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌞</text></svg>"
        />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="og:title" content={PAGE_TITLE} />
      </Head>
      <main className="mx-auto w-full max-w-4xl py-8 sm:px-4">
        <h1 className="mb-2 text-center text-4xl font-bold text-gray-900">Marathon Training Blocks</h1>
        <p className="text-md mx-auto mb-8 max-w-2xl text-center text-gray-900">
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
  try {
    const data = await getTrainingData()
    return { props: { data }, revalidate: REVALIDATE_SECONDS }
  } catch (error) {
    console.error('Training data failed to load from Strava', error)
    // A Strava outage shouldn't fail a deploy; after the build, throwing keeps the last good page.
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return { props: { data: null }, revalidate: RETRY_SECONDS }
    }
    throw error
  }
}
