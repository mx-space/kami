import type { NextApiResponse } from 'next'

import { apiClient } from '~/utils/client'

export default async function handler(_, res: NextApiResponse) {
  const { data } = await apiClient.aggregate.proxy.sitemap.get<{
    data: { url: string; publishedAt: string }[]
  }>()

  const xml = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${data
    .map(
      (item: any) => `<url>
  <loc>${item.url}</loc>
  <lastmod>${item.publishedAt || 'N/A'}</lastmod>
  </url>`,
    )

    .join('')}
  </urlset>
  `.trim()

  res.setHeader('Content-Type', 'application/xml')
  return res.send(xml)
}
