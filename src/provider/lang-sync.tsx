'use client'

import type { FC, PropsWithChildren } from 'react'
import { useEffect, useLayoutEffect } from 'react'

import { useLocaleFromContext } from '~/provider/locale-context'
import { setRequestLocale } from '~/utils/client'

/**
 * Syncs current locale to API client so requests include x-lang header.
 * Backend can return localized content (e.g. Shiroi / mx-space).
 * useLayoutEffect ensures x-lang is set before child useEffects (e.g. posts fetch) run.
 * Reads locale from LocaleContext (single source of truth) so x-lang matches UI.
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
