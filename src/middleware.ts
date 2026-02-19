import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { defaultLocale, type Locale, locales } from '~/i18n/config'

const localePrefixRegex = new RegExp(
  `^/(${(locales as readonly string[]).join('|')})(/|$)`,
)

const LOCALE_COOKIE = 'NEXT_LOCALE'

const localeSet = new Set<string>(locales)

/** Map Accept-Language primary tag to our locale (zh-CN/zh-TW -> zh, en-US -> en, ja -> ja). */
function normalizeAcceptLanguageTag(tag: string): Locale | null {
  const primary = tag.split('-')[0].toLowerCase()
  if (primary === 'zh') return 'zh'
  if (primary === 'en') return 'en'
  if (primary === 'ja') return 'ja'
  return null
}

/**
 * Parse Accept-Language header and return the best matching locale.
 * Format: "en-US,en;q=0.9,zh-CN;q=0.8" -> sorted by q (default 1), first match wins.
 */
function getLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale | null {
  if (!acceptLanguage || !acceptLanguage.trim()) return null
  const ranges = acceptLanguage.split(',').map((part) => {
    const [range, q] = part.trim().split(';q=')
    return { range: (range || '').trim().toLowerCase(), q: q ? parseFloat(q) : 1 }
  })
  ranges.sort((a, b) => b.q - a.q)
  for (const { range } of ranges) {
    if (!range) continue
    const locale = normalizeAcceptLanguageTag(range)
    if (locale && localeSet.has(locale)) return locale
  }
  return null
}

function getPreferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookie && localeSet.has(cookie)) {
    return cookie as Locale
  }
  const fromHeader = getLocaleFromAcceptLanguage(
    request.headers.get('Accept-Language'),
  )
  if (fromHeader) return fromHeader
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const varyHeader = 'Accept-Language'

  // Default locale (zh) must not appear in URL: redirect /zh and /zh/... to / and /...
  if (pathname === '/zh' || pathname.startsWith('/zh/')) {
    const pathWithoutZh = pathname === '/zh' ? '/' : pathname.slice(4)
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = pathWithoutZh
    const res = NextResponse.redirect(redirectUrl)
    res.headers.set('Vary', varyHeader)
    return res
  }

  // Already has /en or /ja prefix: pass through
  if (localePrefixRegex.test(pathname)) {
    return NextResponse.next()
  }

  // No locale prefix: zh → rewrite (URL stays / or /posts), en/ja → redirect (URL becomes /en, /ja/...)
  const locale = getPreferredLocale(request)
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  if (locale === defaultLocale) {
    const res = NextResponse.rewrite(newUrl)
    res.headers.set('Vary', varyHeader)
    return res
  }
  const res = NextResponse.redirect(newUrl)
  res.headers.set('Vary', varyHeader)
  return res
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
