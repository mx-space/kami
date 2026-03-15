import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { defaultLocale, locales } from '~/i18n/config'

const localePrefixRegex = new RegExp(
  `^/(${(locales as readonly string[]).join('|')})(/|$)`,
)

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

  // No locale prefix: always treat as explicit choice for default locale (zh). Rewrite only; do not redirect.
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  const res = NextResponse.rewrite(newUrl)
  res.headers.set('Vary', varyHeader)
  return res
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
