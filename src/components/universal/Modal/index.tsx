import { clsx } from 'clsx'
import { observer } from 'mobx-react-lite'
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { useStore } from '~/store'

import { CloseIcon } from '../Icons/layout'
import { BottomUpTransitionView } from '../Transition/bottom-up'
import styles from './index.module.css'
import { ScaleModalTransition } from './scale-transition'

export interface ModalProps {
  title?: string
  // TODO action
  closeable?: boolean
  onClose?: () => any
  modalClassName?: string
  contentClassName?: string
  noBlur?: boolean
}

export type ModalRefObject = {
  dismiss: () => Promise<void>
}
export const Modal = observer(
  forwardRef<
    ModalRefObject,
    ModalProps & {
      modalId: string
      useBottomDrawerInMobile: boolean
      disposer: () => void
    }
  >((props, ref) => {
    const [modalIn, setIn] = useState(true)
    const dismiss = useCallback(() => {
      return new Promise<void>((resolve) => {
        setIn(false)
        setTimeout(() => {
          resolve(null as any)
          props.disposer()
        }, 300)
      })
    }, [props.disposer])

    useImperativeHandle(ref, () => ({
      dismiss,
    }))

    const {
      appUIStore: {
        viewport: { mobile },
      },
    } = useStore()

    const { title, closeable } = props
    const useDrawerStyle = mobile && props.useBottomDrawerInMobile
    const Children = (
      <div
        className={clsx(
          styles['modal'],
          useDrawerStyle && styles['drawer'],
          props.noBlur && styles['no-blur'],
          props.modalClassName,
        )}
      >
        {title && (
          <div className={styles['title-wrapper']}>
            <h4>{title}</h4>
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
    )

    const timeout = useRef({ exit: 200 }).current
    return useDrawerStyle ? (
      <BottomUpTransitionView in={modalIn} timeout={timeout}>
        {Children}
      </BottomUpTransitionView>
    ) : (
      <ScaleModalTransition in={modalIn} timeout={timeout}>
        {Children}
      </ScaleModalTransition>
    )
  }),
)
