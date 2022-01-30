// @ts-check

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next').default

const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev: false, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)

    handle(req, res, parsedUrl)
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
