import type { FC } from 'react'
import { memo } from 'react'
import { createPortal } from 'react-dom'

import { useIsClient } from '~/hooks/use-is-client'

export const RootPortal: FC = memo((props) => {
  const isClient = useIsClient()
  if (!isClient) {
    return null
  }

  return createPortal(props.children, document.body)
})
