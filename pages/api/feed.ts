import { IncomingMessage, ServerResponse } from 'http'
import { Rest } from 'utils'

export default async function RSSFunc(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const rss = await Rest('Feed').get()
  res.setHeader('Content-Type', 'text/xml')
  res.write(rss)
  res.end()
}
