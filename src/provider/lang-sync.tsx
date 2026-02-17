'use client'

import type { FC, PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { useLocale } from '~/i18n/navigation'
import { setRequestLocale } from '~/utils/client'

/**
 * Syncs current locale to API client so requests include x-lang header.
 * Backend can return localized content (e.g. Shiroi / mx-space).
 */
export const LangSyncProvider: FC<PropsWithChildren<object>> = ({ children }) => {
  const locale = useLocale()

  useEffect(() => {
    setRequestLocale(locale)
    return () => setRequestLocale(null)
  }, [locale])

  return <>{children}</>
}
