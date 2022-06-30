import clsx from 'clsx'
import { forwardRef, useImperativeHandle } from 'react'

import styles from './index.module.css'

export interface ModalProps {
  title?: string

  onClose?: () => any
  modalClassName?: string
}

export type ModalRefObject = {
  dismiss: () => Promise<null>
}
export const Modal = forwardRef<ModalRefObject, ModalProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    dismiss() {
      console.log('000000000000')

      return Promise.resolve(null)
    },
  }))

  const className =
    'bg-light-bg max-w-65vw max-h-70vh min-h-8 min-w-30 rounded-md'

  const { title } = props
  return (
    <div className={clsx(className, props.modalClassName)}>
      {title && (
        <div className={styles['title-wrapper']}>
          <h4>{title}</h4>
        </div>
      )}
      <div className={styles['content']}>{props.children}</div>
    </div>
  )
})
