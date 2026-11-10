import { buildTrainingData, isMarathon, RaceLap, RunActivity, TrainingData } from './training'

const API_URL = 'https://www.strava.com/api/v3'
const TOKEN_URL = 'https://www.strava.com/oauth/token'
const PAGE_SIZE = 200
const MAX_PAGES = 40
const PAGE_REQUESTS_AT_ONCE = 5
const LAP_REQUESTS_AT_ONCE = 10
const RUN_SPORT_TYPES = ['Run', 'TrailRun', 'VirtualRun']

interface StravaActivity {
  id: number
  name: string
  sport_type: string
  start_date_local: string
  distance: number
  moving_time: number
  elapsed_time: number
}

interface StravaLap {
  distance: number
  elapsed_time: number
}

export function hasStravaCredentials() {
  return Boolean(
    process.env.STRAVA_CLIENT_ID && process.env.STRAVA_CLIENT_SECRET && process.env.STRAVA_REFRESH_TOKEN,
  )
}

async function getAccessToken() {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
    }),
  })
  if (!response.ok) throw new Error(`Strava token refresh failed: ${response.status}`)
  const token = (await response.json()) as { access_token: string; refresh_token?: string }
  const hasRotatedRefreshToken = Boolean(token.refresh_token) && token.refresh_token !== process.env.STRAVA_REFRESH_TOKEN
  if (hasRotatedRefreshToken) {
    // Strava may replace the refresh token; the env var can't update itself, so the old one will stop working.
    console.warn('Strava issued a new refresh token. Run `npm run strava:auth` and update STRAVA_REFRESH_TOKEN in Vercel.')
  }
  return token.access_token
}

async function stravaGet<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${accessToken}` } })
  if (!response.ok) throw new Error(`Strava request failed: ${response.status} ${path}`)
  return (await response.json()) as T
}

async function fetchRuns(accessToken: string): Promise<RunActivity[]> {
  const runs: RunActivity[] = []
  for (let firstPage = 1; firstPage <= MAX_PAGES; firstPage += PAGE_REQUESTS_AT_ONCE) {
    const pageNumbers = Array.from({ length: PAGE_REQUESTS_AT_ONCE }, (_, i) => firstPage + i)
    const pages = await Promise.all(
      pageNumbers.map((page) =>
        stravaGet<StravaActivity[]>(`/athlete/activities?per_page=${PAGE_SIZE}&page=${page}`, accessToken),
      ),
    )
    pages.forEach((activities) => {
      activities
        .filter((activity) => RUN_SPORT_TYPES.includes(activity.sport_type))
        .forEach((activity) => {
          runs.push({
            id: String(activity.id),
            name: activity.name,
            sportType: activity.sport_type,
            date: activity.start_date_local.slice(0, 10),
            meters: activity.distance,
            movingSeconds: activity.moving_time,
            elapsedSeconds: activity.elapsed_time,
          })
        })
    })
    // Strava can return short pages mid-list, so only an empty page means the end.
    if (pages.some((activities) => activities.length === 0)) break
  }
  return runs
}

async function fetchLaps(accessToken: string, raceIds: string[]) {
  const lapsByRaceId: Record<string, RaceLap[]> = {}
  for (let i = 0; i < raceIds.length; i += LAP_REQUESTS_AT_ONCE) {
    const batch = raceIds.slice(i, i + LAP_REQUESTS_AT_ONCE)
    const results = await Promise.all(
      batch.map((id) => stravaGet<StravaLap[]>(`/activities/${id}/laps`, accessToken)),
    )
    results.forEach((laps, index) => {
      lapsByRaceId[batch[index]] = laps.map((lap) => ({ meters: lap.distance, elapsedSeconds: lap.elapsed_time }))
    })
  }
  return lapsByRaceId
}

export async function getTrainingData(): Promise<TrainingData> {
  const accessToken = await getAccessToken()
  const runs = await fetchRuns(accessToken)
  const raceIds = runs.filter(isMarathon).map((run) => run.id)
  const lapsByRaceId = await fetchLaps(accessToken, raceIds)
  return buildTrainingData(runs, lapsByRaceId, new Date().toISOString())
}
