import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { useEffect } from 'react'

import { ModalStackProvider } from '@mx-space/kami-design/components/Modal'

import { useJotaiStore } from '~/atoms/store'
import { useStore } from '~/store'

export const DebugLayout: FC = observer((props) => {
  const appStore = useJotaiStore('app')
  useEffect(() => {
    appStore.updateViewport()

    window.onresize = () => {
      appStore.updateViewport()
    }
  }, [])

  const { mobile } = useStore().appUIStore.viewport

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
