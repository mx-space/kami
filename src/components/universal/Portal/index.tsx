import type { FC } from 'react'
import { memo } from 'react'
import { createPortal } from 'react-dom'
import { isServerSide } from 'utils'

export const RootPortal: FC = memo((props) => {
  if (isServerSide()) {
    return null
  }

  return createPortal(props.children, document.body)
})
