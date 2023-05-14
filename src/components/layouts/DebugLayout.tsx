import type { FC } from 'react'
import { memo, useEffect } from 'react'

import { useAppStore } from '~/atoms/app'
import { ModalStackProvider } from '~/components/ui/Modal'

export const DebugLayout: FC = memo((props) => {
  useEffect(() => {
    useAppStore.getState().updateViewport()
  }, [])

  const mobile = useAppStore((state) => state.viewport.mobile)

  return (
    <ModalStackProvider isMobileViewport={mobile}>
      <div
        style={{
          maxWidth: '600px',
          margin: '100px auto 0',
          position: 'relative',
        }}
      >
        {props.children}
      </div>
    </ModalStackProvider>
  )
})
