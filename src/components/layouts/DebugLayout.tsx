import type { FC } from 'react'
import { useEffect } from 'react'

import { ModalStackProvider } from '@mx-space/kami-design/components/Modal'

import { store } from '~/store'

export const DebugLayout: FC = (props) => {
  useEffect(() => {
    store.appUIStore.updateViewport()

    window.onresize = () => {
      store.appUIStore.updateViewport()
    }
  }, [])
  return (
    <ModalStackProvider isMobileSize={false}>
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
}
