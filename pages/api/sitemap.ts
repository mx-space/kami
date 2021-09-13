import { IncomingMessage, ServerResponse } from 'http'
import { http } from 'utils'

export default async function sitemapFunc(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const xml = await http.get('sitemap')
  res.setHeader('Content-Type', 'text/xml')
  res.write(xml)
  res.end()
}
