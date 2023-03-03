import type { FC } from 'react'
import { SWRConfig } from 'swr'
import type { FullConfiguration, ProviderConfiguration } from 'swr/_internal'

import { isClientSide } from '~/utils/env'

const swrConfig = {
  refreshInterval: 30_000,
  // @ts-ignore
  provider: localStorageProvider,
} satisfies FullConfiguration & ProviderConfiguration

export const SWRProvider: FC<{ children?: JSX.Element }> = ({ children }) => {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>
}

export function localStorageProvider() {
  if (!isClientSide()) {
    return new Map()
  }
  const key = 'kami-app-cache'
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem(key) || '[]'))

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem(key, appCache)
  })

  // We still use the map for write & read for performance.
  return map
}
