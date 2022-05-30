import type { IncomingMessage, ServerResponse } from 'http'

import { apiClient } from '~/utils/client'

export default async function RSSFunc(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const rss = await apiClient.proxy.feed.get()
  res.setHeader('Content-Type', 'text/xml')
  res.write(rss)
  res.end()
}
