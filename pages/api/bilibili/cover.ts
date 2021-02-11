/*
 * @Author: Innei
 * @Date: 2021-02-11 13:01:38
 * @LastEditTime: 2021-02-11 13:33:29
 * @LastEditors: Innei
 * @FilePath: /web/pages/api/bilibili/cover.ts
 * @Mark: Coding with Love
 */

import axios from 'axios'
import { IncomingMessage, ServerResponse } from 'http'
import { parse as QParse } from 'querystring'
import { parse } from 'url'
import { writeBody } from 'utils'
export default async function (req: IncomingMessage, res: ServerResponse) {
  const queryObject = QParse(parse(req.url!).query!)

  const { src } = queryObject
  if (!src) {
    return writeBody(res, {}, 422)
  }
  try {
    const $api = axios.create()
    $api
      .get(src as string, { responseType: 'arraybuffer' })
      .then((response) => Buffer.from(response.data, 'binary'))
      .then((buffer) => {
        res.write(buffer, 'binary')
        res.end(null, 'binary')
      })
  } catch {
    writeBody(res, { message: 'error' }, 400)
  }
}
