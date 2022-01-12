/*
 * @Author: Innei
 * @Date: 2021-02-11 13:01:38
 * @LastEditTime: 2021-02-11 13:53:22
 * @LastEditors: Innei
 * @FilePath: /web/pages/api/bilibili/bangumi.ts
 * @Mark: Coding with Love
 */

import { BiliClient } from '@mx-space/extra'
import { IncomingMessage, ServerResponse } from 'http'
import { parse as QParse } from 'querystring'
import { parse } from 'url'
import { writeBody } from 'utils'
export default async function getBangumi(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const queryObject = QParse(parse(req.url!).query!)

  const { uid, len = 10 } = queryObject
  try {
    const client = new BiliClient(parseInt(uid as any))
    const bangumi = await client.getFavoriteBangumi(parseInt(len as string))

    writeBody(res, {
      data: bangumi,
    })
  } catch (e) {
    console.log(e)

    writeBody(res, { message: 'error' }, 400)
  }
}
