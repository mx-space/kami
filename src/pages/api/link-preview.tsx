import type { NextApiRequest, NextApiResponse } from 'next'
import { isIP } from 'node:net'

const BLOCKED_HOSTNAMES = new Set(['localhost', '0.0.0.0', '::1'])
const PRIVATE_IPV4_RANGES = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
]

type LinkPreviewResponse = {
  title: string
  description?: string
  image?: string
  url: string
}

const stripTags = (value: string) =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const parseMetaContent = (
  html: string,
  attrName: 'property' | 'name',
  attrValue: string,
) => {
  const pattern = new RegExp(
    `<meta[^>]*${attrName}=["']${escapeRegex(attrValue)}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    'i',
  )
  return pattern.exec(html)?.[1]?.trim()
}

const parseTitle = (html: string) => {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)
  return match?.[1] ? decodeHtmlEntities(stripTags(match[1])) : undefined
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const isPrivateIpv4 = (ip: string) => {
  if (!isIP(ip)) {
    return false
  }
  return PRIVATE_IPV4_RANGES.some((pattern) => pattern.test(ip))
}

const isBlockedTarget = (url: URL) => {
  const hostname = url.hostname.toLowerCase()
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return true
  }

  const ipType = isIP(hostname)
  if (!ipType) {
    return false
  }
  if (ipType === 6) {
    // Block direct IPv6 targets by default for basic SSRF mitigation.
    return true
  }
  return isPrivateIpv4(hostname)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LinkPreviewResponse | { error: string }>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const queryValue = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url
  if (!queryValue) {
    return res.status(400).json({ error: 'Missing url query parameter' })
  }

  let targetUrl: URL
  try {
    targetUrl = new URL(queryValue)
  } catch {
    return res.status(400).json({ error: 'Invalid url' })
  }

  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    return res.status(400).json({ error: 'Only http(s) url is allowed' })
  }

  if (isBlockedTarget(targetUrl)) {
    return res.status(400).json({ error: 'Blocked target host' })
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
      headers: {
        'user-agent':
          'Mozilla/5.0 (compatible; KamiLinkPreviewBot/1.0; +https://www.timochan.cn)',
      },
    })

    if (!response.ok) {
      return res.status(502).json({ error: `Upstream status ${response.status}` })
    }

    const finalUrl = new URL(response.url || targetUrl.toString())
    if (isBlockedTarget(finalUrl)) {
      return res.status(400).json({ error: 'Blocked redirect target host' })
    }

    const html = await response.text()

    const title =
      parseMetaContent(html, 'property', 'og:title') ||
      parseMetaContent(html, 'name', 'twitter:title') ||
      parseTitle(html) ||
      finalUrl.hostname
    const description =
      parseMetaContent(html, 'property', 'og:description') ||
      parseMetaContent(html, 'name', 'description') ||
      parseMetaContent(html, 'name', 'twitter:description')
    const image =
      parseMetaContent(html, 'property', 'og:image') ||
      parseMetaContent(html, 'name', 'twitter:image')

    return res.status(200).json({
      title,
      description,
      image,
      url: finalUrl.toString(),
    })
  } catch {
    return res.status(500).json({ error: 'Failed to fetch metadata' })
  }
}
