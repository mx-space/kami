import clsx from 'clsx'
import { forwardRef, useCallback, useImperativeHandle } from 'react'

import styles from './index.module.css'

export interface ModalProps {
  title?: string
  // TODO action

  onClose?: () => any
  modalClassName?: string
}

export type ModalRefObject = {
  dismiss: () => Promise<void>
}
export const Modal = forwardRef<ModalRefObject, ModalProps>((props, ref) => {
  const dismiss = useCallback(async () => {
    return Promise.resolve(undefined)
  }, [])

  useImperativeHandle(ref, () => ({
    dismiss,
  }))

  const className =
    'bg-light-bg max-w-65vw max-h-70vh min-h-8 min-w-30 rounded-md block overflow-hidden shadow-md relative'

  const { title } = props
  return (
    <div className={clsx(className, props.modalClassName)}>
      {title && (
        <div className={styles['title-wrapper']}>
          <h4>{title}</h4>
        </div>
      )}
      <div
        className="absolute h-12 top-0 right-0 w-10 flex items-center justify-center"
        onClick={dismiss}
        role={'button'}
      >
        <CloseIcon />
      </div>
      <div className={styles['content']}>{props.children}</div>
    </div>
  )
})

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.2em"
    height="1.2em"
    viewBox="0 0 32 32"
  >
    <path
      fill="currentColor"
      d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"
    ></path>
  </svg>
)
