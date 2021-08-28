import { BiliClient } from '@mx-space/extra'
import { IncomingMessage, ServerResponse } from 'http'
import { parse as QParse } from 'querystring'
import { parse } from 'url'
import { writeBody } from 'utils'

/*
 * @Author: Innei
 * @Date: 2021-02-11 13:30:21
 * @LastEditTime: 2021-02-11 13:53:01
 * @LastEditors: Innei
 * @FilePath: /web/pages/api/bilibili/video.ts
 * @Mark: Coding with Love
 */

export default async function (req: IncomingMessage, res: ServerResponse) {
  const queryObject = QParse(parse(req.url!).query!)

  const { uid, len = 10 } = queryObject
  try {
    const client = new BiliClient(parseInt(uid as any))
    const data = await client.getPersonalVideo(parseInt(len as string))

    writeBody(res, {
      data,
    })
  } catch {
    writeBody(res, { message: 'error' }, 400)
  }
}
