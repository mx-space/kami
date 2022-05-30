import type { IncomingMessage, ServerResponse } from 'http'

import { apiClient } from '~/utils/client'

export default async function sitemapFunc(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const xml = await apiClient.proxy.sitemap.get()
  res.setHeader('Content-Type', 'text/xml')
  res.write(xml)
  res.end()
}
