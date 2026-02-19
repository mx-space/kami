'use client'

import type { FC, PropsWithChildren } from 'react'
import { useLayoutEffect } from 'react'

import { useLocale } from '~/i18n/navigation'
import { setRequestLocale } from '~/utils/client'

/**
 * Syncs current locale to API client so requests include x-lang header.
 * Backend can return localized content (e.g. Shiroi / mx-space).
 * useLayoutEffect ensures x-lang is set before child useEffects (e.g. posts fetch) run.
 */
export const LangSyncProvider: FC<PropsWithChildren<object>> = ({ children }) => {
  const locale = useLocale()

  useLayoutEffect(() => {
    setRequestLocale(locale)
    return () => setRequestLocale(null)
  }, [locale])

  return <>{children}</>
}
