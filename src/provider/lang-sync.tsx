'use client'

import type { FC, PropsWithChildren } from 'react'
import { useEffect, useLayoutEffect } from 'react'

import { useLocaleFromContext } from '~/provider/locale-context'
import { setRequestLocale } from '~/utils/client'

/**
 * Keeps the compatibility `x-lang` header synchronized with the URL locale.
 * The request interceptor also reads the URL directly, so child effects cannot
 * race this provider during a locale switch.
 */
export const LangSyncProvider: FC<PropsWithChildren<object>> = ({ children }) => {
  const locale = useLocaleFromContext()
  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect

  useIsomorphicLayoutEffect(() => {
    setRequestLocale(locale)
    return () => setRequestLocale(null)
  }, [locale])

  return <>{children}</>
}
