import { IncomingMessage, ServerResponse } from 'http'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Rest } from '../../utils/api'

async function fetchContentFromAPI() {
  return Rest('Aggregate').get('sitemap')
}

export default async function sitemapFunc(
  req: IncomingMessage,
  res: ServerResponse,
) {
  res.setHeader('Content-Type', 'text/xml')
  try {
    const stories = ((await fetchContentFromAPI()) as any).data as {
      url: string
      publishedAt: string
    }[]

    const smStream = new SitemapStream({
      hostname: 'https://' + req.headers.host,
    })
    for (const story of stories) {
      smStream.write({
        url: story.url,
        lastmod: story.publishedAt,
      })
    }
    smStream.end()
    const sitemap = await streamToPromise(smStream).then((sm) => sm.toString())
    res.write(sitemap)
    res.end()
  } catch (e) {
    res.statusCode = 500
    res.end()
  }
}
