import express from 'express'
import next from 'next'
import { router } from './routers'
import cors from 'cors'

const port = parseInt(process.env.PORT || '2323', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(cors())
  server.use('/_extra', router)
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err: any) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
