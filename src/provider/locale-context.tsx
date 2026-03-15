'use client'

/**
 * Locale contract (single source of truth):
 * - Source: current URL only (pathname/asPath). No separate locale store.
 * - Read: server use getLocaleFromContext(ctx); components use useLocaleFromContext() or useLocale().
 * - Write: use Link from ~/i18n/navigation (href + as are localized); programmatic use useRouter().push(pathname, { locale }).
 * - API: setRequestLocale is set only by _app getInitialProps and LangSyncProvider. Components do not call setRequestLocale.
 */

import React, {
  createContext,
  useContext,
  useMemo,
  type FC,
  type PropsWithChildren,
} from 'react'

import type { Locale } from '~/i18n/config'
import { defaultLocale } from '~/i18n/config'
import { useLocale as useLocaleFromRouter } from '~/i18n/navigation'

const LocaleContext = createContext<Locale>(defaultLocale)

/**
 * Provider that supplies the current locale as global state.
 * - Server / first paint: uses initialLocale from _app (getLocaleFromContext in getInitialProps).
 * - Client: uses router (useLocale from i18n/navigation) so locale stays in sync with URL.
 * All components and API request layer (setRequestLocale) should consume this for a single source of truth.
 */
export const LocaleProvider: FC<
  PropsWithChildren<{ initialLocale: Locale }>
> = ({ initialLocale, children }) => {
  const routerLocale = useLocaleFromRouter()
  const locale =
    typeof window === 'undefined' ? initialLocale : routerLocale
  const value = useMemo(() => locale, [locale])
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocaleFromContext(): Locale {
  const locale = useContext(LocaleContext)
  return locale ?? defaultLocale
}
