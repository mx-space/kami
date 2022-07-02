import type { FC } from 'react'
import { useEffect } from 'react'

import { store } from '~/store'

import { ModalStackProvider } from '../universal/Modal/stack.context'

export const DebugLayout: FC = (props) => {
  useEffect(() => {
    store.appUIStore.updateViewport()

    window.onresize = () => {
      store.appUIStore.updateViewport()
    }
  }, [])
  return (
    <ModalStackProvider>
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
