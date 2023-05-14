import type { FC } from 'react'
import { memo } from 'react'
import { createPortal } from 'react-dom'

import { useIsClient } from '~/hooks/common/use-is-client'

import { useRootPortal } from './provider'

export const RootPortal: FC<{
  to?: HTMLElement
}> = memo((props) => {
  const isClient = useIsClient()
  const to = useRootPortal()
  if (!isClient) {
    return null
  }

  return createPortal(props.children, props.to || to || document.body)
})
