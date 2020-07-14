/*
 * @Author: Innei
 * @Date: 2020-04-30 11:04:43
 * @LastEditTime: 2020-07-14 21:04:47
 * @LastEditors: Innei
 * @FilePath: /mx-web/server/index.ts
 * @Coding with Love
 */

import express from 'express'
import next from 'next'
import { router } from './routers'
import cors from 'cors'
import apicache from 'apicache'
import redis from 'redis'

const port = parseInt(process.env.PORT || '2323', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = (req, res) => app.getRequestHandler()(req, res)

// @ts-ignore
const REDIS = Boolean(~~process.env.REDIS || 0)

app
  .prepare()
  .then(() => {
    const server = express()

    const cache =
      process.env.NODE_ENV === 'production'
        ? REDIS
          ? apicache.options({ redisClient: redis.createClient() }).middleware
          : apicache.middleware
        : () => (req, res, next) => next()
    if (process.env.NODE_ENV === 'development') {
      server.use(cors())
    }
    server.use('/_extra', cache('120 minutes'), router)
    server.get('/feed', cache('120 minutes'), handle)
    server.get('/atom.xml', cache('120 minutes'), handle)
    server.get('*', handle)

    server.listen(port, (err: any) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch((e) => {
    if (dev) {
      console.error(e)
    } else {
      console.log(e.message)
    }
  })
