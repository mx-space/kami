import { BiliClient } from '@mx-space/extra'
import { Router } from 'express'
export const biliRouter = Router()
import axios from 'axios'
biliRouter.get('/bangumi', async (req, res) => {
  const { uid, len = 30 } = req.query
  if (!uid || typeof parseInt(uid as any) !== 'number') {
    return res.status(422).send({
      message: 'uid 必须为数字',
    })
  }

  if (typeof parseInt(len as string) !== 'number') {
    return res.status(422).send({
      message: 'len 必须为数字',
    })
  }
  const client = new BiliClient(parseInt(uid as any))
  const bangumi = await client.getFavoriteBangumi(parseInt(len as string))
  res.send({
    data: bangumi,
  })
})

biliRouter.get('/video', async (req, res) => {
  const { uid, len = 30 } = req.query
  if (!uid || typeof parseInt(uid as any) !== 'number') {
    return res.status(422).send({
      message: 'uid 必须为数字',
    })
  }

  if (typeof parseInt(len as string) !== 'number') {
    return res.status(422).send({
      message: 'len 必须为数字',
    })
  }
  const client = new BiliClient(parseInt(uid as any))
  const data = await client.getPersonalVideo(parseInt(len as string))
  res.send({
    data,
  })
})

biliRouter.get('/cover', async (req, res) => {
  const { src } = req.query
  if (!src) {
    return res.send()
  }
  const $api = axios.create()
  $api
    .get(src as string, { responseType: 'arraybuffer' })
    .then((response) => Buffer.from(response.data, 'binary'))
    .then((buffer) => {
      res.send(buffer)
    })
})
