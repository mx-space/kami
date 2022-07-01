import clsx from 'clsx'
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import styles from './index.module.css'
import { ScaleModalTransition } from './scale-transition'

export interface ModalProps {
  title?: string
  // TODO action
  closeable?: boolean
  onClose?: () => any
  modalClassName?: string
  contentClassName?: string
}

export type ModalRefObject = {
  dismiss: () => Promise<void>
}
export const Modal = forwardRef<ModalRefObject, ModalProps>((props, ref) => {
  const [modalIn, setIn] = useState(true)
  const dismiss = useCallback(() => {
    return new Promise<void>((resolve) => {
      setIn(false)
      setTimeout(() => {
        resolve(null as any)
      }, 250)
    })
  }, [])

  useImperativeHandle(ref, () => ({
    dismiss,
  }))

  const { title, closeable } = props
  return (
    <ScaleModalTransition in={modalIn} timeout={{ exit: 240 }}>
      <div className={clsx(styles['modal'], props.modalClassName)}>
        {title && (
          <div className={styles['title-wrapper']}>
            <h4>{title}</h4>

            {/* <Divider className="absolute bottom-0 left-0 right-0 !m-0" /> */}
          </div>
        )}
        {closeable && (
          <div
            className={styles['close-btn']}
            onClick={dismiss}
            role={'button'}
          >
            <CloseIcon />
          </div>
        )}
        <div
          className={clsx(
            styles['content'],
            title && styles['has-title'],
            props.contentClassName,
          )}
        >
          {props.children}
        </div>
      </div>
    </ScaleModalTransition>
  )
})

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.4em"
    height="1.4em"
    viewBox="0 0 32 32"
  >
    <path
      fill="currentColor"
      d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"
    ></path>
  </svg>
)
