import type { FC } from 'react'
import { useEffect } from 'react'

import { useNetworkStore } from '~/atoms/network'
import { useIsClient } from '~/hooks/common/use-is-client'

export const NetworkLoadingBridge: FC = () => {
  const isClient = useIsClient()
  const active = useNetworkStore((s) => s.activeRequestCount)

  useEffect(() => {
    if (!isClient) return
    document.documentElement.dataset.networkLoading = active > 0 ? '1' : '0'
  }, [active, isClient])

  return null
}

