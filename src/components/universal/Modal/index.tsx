import { clsx } from 'clsx'
import { observer } from 'mobx-react-lite'
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

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
        }, 200)
      })
    }, [props])

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
    )
    return useDrawerStyle ? (
      <BottomUpTransitionView in={modalIn} timeout={{ exit: 200 }}>
        {Children}
      </BottomUpTransitionView>
    ) : (
      <ScaleModalTransition in={modalIn} timeout={{ exit: 200 }}>
        {Children}
      </ScaleModalTransition>
    )
  }),
)
