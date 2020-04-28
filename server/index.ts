import express from 'express'
import next from 'next'
import { router } from './routers'
import cors from 'cors'
import apicache from 'apicache'

const port = parseInt(process.env.PORT || '2323', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  const cache =
    process.env.NODE_ENV === 'production'
      ? apicache.middleware
      : () => (req, res, next) => next()
  server.use(cors())
  server.use('/_extra', router)
  server.get('/feed', cache('60 minutes'), (req, res) => {
    return handle(req, res)
  })
  server.get('/atom.xml', cache('60 minutes'), (req, res) => {
    return handle(req, res)
  })
  server.get('*', cache('3 minutes'), (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err: any) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
