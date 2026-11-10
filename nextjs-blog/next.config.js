// The blog, about and vlogs pages are hidden for now: their files remain, but every route lands on the training page.
const HIDDEN_ROUTES = ['/blog', '/about', '/vlogs', '/posts/:path*', '/training']

module.exports = {
  async redirects() {
    return HIDDEN_ROUTES.map((source) => ({ source, destination: '/', permanent: false }))
  },
}
