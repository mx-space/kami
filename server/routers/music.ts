import { NeteaseMusic } from '@mx-space/extra'
import { Router } from 'express'
export const musicRouter = Router()

musicRouter.get('/music', async (req, res) => {
  const { NETEASE_PHONE, NETEASE_PASSWORD } = process.env
  if (
    typeof NETEASE_PASSWORD !== 'string' &&
    typeof NETEASE_PHONE !== 'string'
  ) {
    return res.status(422).send({
      message: '请先填写网易云登录信息',
    })
  }
  const client = new NeteaseMusic(
    NETEASE_PHONE as string,
    NETEASE_PASSWORD as string,
  )
  await client.Login()
  const weekdata = await client.getWeekData()
  const alldata = await client.getAllData()
  const uid = client.user.id
  res.send({
    weekdata,
    alldata,
    uid,
  })
})
