import type { FC } from 'react'

import { ModalStackProvider } from '../universal/Modal/stack.context'

export const DebugLayout: FC = (props) => {
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
