import clsx from 'clsx'
import type { FC } from 'react'

export interface ModalProps {
  title?: string

  onClose?: () => any
  modalClassName?: string
}

export const Modal: FC<ModalProps> = (props) => {
  return (
    <div className={clsx('bg-white h-50 w-50 fixed', props.modalClassName)}>
      {props.children}
    </div>
  )
}
