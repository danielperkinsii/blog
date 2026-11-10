// One-time helper: gets a Strava refresh token and saves it to .env.local.
// Usage: put STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET in .env.local, then `npm run strava:auth`.
import { createServer } from 'node:http'
import { appendFileSync, existsSync, readFileSync } from 'node:fs'

const ENV_FILE = '.env.local'
const PORT = 8721
const REDIRECT_URI = `http://localhost:${PORT}/callback`
// activity:read_all includes activities set to "Only You"; without it private runs are missing from blocks.
const SCOPE = 'read,activity:read_all'

const envText = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8') : ''
const readEnv = (name) => {
  const value = (envText.match(new RegExp(`^${name}=(.*)$`, 'm')) || [])[1]?.trim()
  return value?.replace(/^(["'])(.*)\1$/, '$2')
}
const clientId = readEnv('STRAVA_CLIENT_ID')
const clientSecret = readEnv('STRAVA_CLIENT_SECRET')

if (!clientId || !clientSecret) {
  console.error(`Add STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET to ${ENV_FILE} first (from strava.com/settings/api).`)
  process.exit(1)
}
if (readEnv('STRAVA_REFRESH_TOKEN')) {
  console.error(`${ENV_FILE} already has STRAVA_REFRESH_TOKEN. Remove that line to get a new one.`)
  process.exit(1)
}

const authorizeUrl =
  'https://www.strava.com/oauth/authorize' +
  `?client_id=${clientId}&response_type=code&approval_prompt=force` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPE}`

const server = createServer(async (request, response) => {
  const url = new URL(request.url, REDIRECT_URI)
  if (url.pathname !== '/callback') {
    response.writeHead(404).end()
    return
  }
  const code = url.searchParams.get('code')
  if (!code) {
    response.end('Strava did not return a code. Close this tab and run the script again.')
    server.close()
    return
  }
  const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, grant_type: 'authorization_code' }),
  })
  const token = await tokenResponse.json()
  if (!tokenResponse.ok || !token.refresh_token) {
    response.end('Strava rejected the code. Check the terminal.')
    console.error('Token exchange failed:', tokenResponse.status, token.message || '', JSON.stringify(token.errors || []))
    server.close()
    return
  }
  const needsNewline = envText.length > 0 && !envText.endsWith('\n')
  appendFileSync(ENV_FILE, `${needsNewline ? '\n' : ''}STRAVA_REFRESH_TOKEN=${token.refresh_token}\n`)
  response.end('Done. STRAVA_REFRESH_TOKEN is saved in .env.local. You can close this tab.')
  console.log(`Saved STRAVA_REFRESH_TOKEN to ${ENV_FILE}. Add the same three variables to Vercel.`)
  server.close()
})

server.listen(PORT, () => {
  console.log('Open this URL, approve access, and wait for the "Done" page:\n')
  console.log(authorizeUrl + '\n')
})
