import type { FC } from 'react'

export const DebugLayout: FC = (props) => {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '100px auto 0',
        position: 'relative',
      }}
    >
      {props.children}
    </div>
  )
}
