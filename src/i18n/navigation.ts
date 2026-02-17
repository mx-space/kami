import NextLink from 'next/link'
import { useRouter as useNextRouter } from 'next/router'
import React, { type ComponentProps } from 'react'

import type { Locale } from '~/i18n/config'
import { defaultLocale, locales } from '~/i18n/config'
import { routing } from '~/i18n/routing'

const localeSet = new Set<string>(locales)

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && localeSet.has(value)
}

function resolveLocaleFromQueryOrPath(
  queryLocale: unknown,
  pathname: string,
  asPath: string,
): Locale {
  if (isLocale(queryLocale)) return queryLocale
  const asPathWithoutQuery = asPath.split('?')[0]
  const firstSegment = asPathWithoutQuery.split('/').filter(Boolean)[0]
  if (isLocale(firstSegment)) return firstSegment
  const pathFirst = pathname.split('/').filter(Boolean)[0]
  if (isLocale(pathFirst)) return pathFirst
  return defaultLocale
}

export type LocaleContext = {
  pathname?: string
  asPath?: string
  query?: Record<string, string | string[] | undefined>
}

/**
 * Resolve current locale from Next.js page context (pathname, asPath, query).
 * Use at the start of getInitialProps so API requests use the correct x-lang.
 */
export function getLocaleFromContext(ctx: LocaleContext): Locale {
  const pathname = ctx.pathname ?? ''
  const asPath = ctx.asPath ?? pathname
  const queryLocale = ctx.query?.locale
  return resolveLocaleFromQueryOrPath(queryLocale, pathname, asPath)
}

/**
 * Pathname without locale prefix (e.g. /posts/cat/slug).
 */
export function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]
  if (
    first &&
    (routing.locales as readonly string[]).includes(first)
  ) {
    return `/${segments.slice(1).join('/')}` || '/'
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

/**
 * Build href with locale prefix. For defaultLocale with localePrefix 'as-needed', no prefix.
 */
export function buildLocalizedHref(
  pathname: string,
  locale: string = defaultLocale,
): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (locale === defaultLocale && routing.localePrefix === 'as-needed') {
    return normalized
  }
  return `/${locale}${normalized}`
}

/**
 * Current locale from router (when under [locale] route).
 * Uses pathname/asPath when localePrefix is 'as-needed' and query.locale is absent.
 */
export function useLocale(): Locale {
  const router = useNextRouter()
  const pathname = router?.pathname ?? ''
  const asPath = router?.asPath ?? pathname
  const queryLocale = router?.query?.locale
  return resolveLocaleFromQueryOrPath(queryLocale, pathname, asPath)
}

/**
 * Pathname without locale (for language switcher). Uses asPath for actual URL.
 */
export function usePathname(): string {
  const router = useNextRouter()
  return getPathnameWithoutLocale(router?.asPath?.split('?')[0] ?? '/')
}

/**
 * Link that prefixes href with current locale.
 * Pass pathname without locale prefix (e.g. /posts/cat/slug).
 */
export function Link({
  href,
  locale: localeProp,
  ...rest
}: ComponentProps<typeof NextLink> & { locale?: string }) {
  const router = useNextRouter()
  const pathnameForLocale = router?.pathname ?? ''
  const asPathForLocale = router?.asPath ?? pathnameForLocale
  const currentLocale =
    localeProp ??
    resolveLocaleFromQueryOrPath(
      router?.query?.locale,
      pathnameForLocale,
      asPathForLocale,
    )
  const pathname =
    typeof href === 'string'
      ? href
      : href && typeof href === 'object' && 'pathname' in href
        ? (href as { pathname: string }).pathname
        : ''
  const resolvedHref = pathname ? buildLocalizedHref(pathname, currentLocale) : href
  return React.createElement(NextLink, { href: resolvedHref, ...rest })
}

/** Alias for Link (Shiroi uses Link; Kami may use LocaleLink elsewhere). */
export const LocaleLink = Link

/**
 * Router that supports push(pathname, { locale }) for language switch.
 */
export function useRouter() {
  const router = useNextRouter()
  return {
    ...router,
    push: (
      pathname: string,
      options?: { locale?: string; scroll?: boolean; shallow?: boolean },
    ) => {
      const locale =
        options?.locale ??
        resolveLocaleFromQueryOrPath(
          router.query?.locale,
          router.pathname ?? '',
          router.asPath ?? '',
        )
      const href = buildLocalizedHref(pathname, locale)
      return router.push(href, undefined, {
        scroll: options?.scroll,
        shallow: options?.shallow,
      })
    },
    replace: (
      pathname: string,
      options?: { locale?: string; scroll?: boolean; shallow?: boolean },
    ) => {
      const locale =
        options?.locale ??
        resolveLocaleFromQueryOrPath(
          router.query?.locale,
          router.pathname ?? '',
          router.asPath ?? '',
        )
      const href = buildLocalizedHref(pathname, locale)
      return router.replace(href, undefined, {
        scroll: options?.scroll,
        shallow: options?.shallow,
      })
    },
  }
}

export function getPathname(pathname: string): string {
  return getPathnameWithoutLocale(pathname)
}

export { defaultLocale, type Locale }
