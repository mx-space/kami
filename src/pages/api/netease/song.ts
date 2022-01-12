/*
 * @Author: Innei
 * @Date: 2021-06-28 11:26:55
 * @LastEditTime: 2021-06-28 12:11:24
 * @LastEditors: Innei
 * @FilePath: /web/pages/api/netease/song.ts
 * Mark: Coding with Love
 */

import { song_url } from 'NeteaseCloudMusicApi'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id
  if (!id || isNaN(+id)) {
    res.end(`id must be number`)
    return
  }

  const data = await song_url({
    id: +id,
  })

  res.send(data.body.data)
}
