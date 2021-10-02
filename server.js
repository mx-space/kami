// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)

    handle(req, res, parsedUrl)
  }).listen(2323, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:2323')
  })
})

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error.message)
})
