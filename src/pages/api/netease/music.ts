import { NeteaseMusic } from '@mx-space/extra'
import { IncomingMessage, ServerResponse } from 'http'
import { writeBody } from 'utils'
export default async function (req: IncomingMessage, res: ServerResponse) {
  try {
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
  } catch (err: any) {
    console.log(err)
    writeBody(res, { message: err.message }, 500)
  }
}
