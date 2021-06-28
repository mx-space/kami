/*
 * @Author: Innei
 * @Date: 2021-02-11 13:54:34
 * @LastEditTime: 2021-06-28 11:26:48
 * @LastEditors: Innei
 * @FilePath: /web/pages/api/netease/music.ts
 * @Mark: Coding with Love
 */

import { NeteaseMusic } from '@mx-space/extra'
import { IncomingMessage, ServerResponse } from 'http'
import { writeBody } from 'utils'

export default async function (req: IncomingMessage, res: ServerResponse) {
  const { NETEASE_PHONE, NETEASE_PASSWORD } = process.env
  if (
    typeof NETEASE_PASSWORD !== 'string' &&
    typeof NETEASE_PHONE !== 'string'
  ) {
    return writeBody(
      res,
      {
        message: '请先填写网易云登录信息',
      },
      422,
    )
  }
  const client = new NeteaseMusic(
    NETEASE_PHONE as string,
    NETEASE_PASSWORD as string,
  )
  await client.Login()

  const weekdata = await client.getWeekData()
  const alldata = await client.getAllData()
  const playlist = await client.getFavorite()

  const responsePayload = {
    playlist,
    weekdata,
    alldata,
  }

  writeBody(res, responsePayload)
}
