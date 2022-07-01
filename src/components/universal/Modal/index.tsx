import clsx from 'clsx'
import { forwardRef, useCallback, useImperativeHandle } from 'react'

import { LaTimes } from '../Icons/layout'
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
    'bg-light-bg max-w-65vw max-h-70vh min-h-8 min-w-30 rounded-md block overflow-hidden shadow-md'

  const { title } = props
  return (
    <div className={clsx(className, props.modalClassName)}>
      {title && (
        <div className={styles['title-wrapper']}>
          <h4>{title}</h4>
        </div>
      )}
      <div
        className="absolute h-12 top-0 right-0 w-12 flex items-center justify-center"
        onClick={dismiss}
        role={'button'}
      >
        <LaTimes />
      </div>
      <div className={styles['content']}>{props.children}</div>
    </div>
  )
})
