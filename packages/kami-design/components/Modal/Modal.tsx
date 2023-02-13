import { clsx } from 'clsx'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { CloseIcon } from '@mx-space/kami-design/components/Icons/layout'
import { RootPortalProvider } from '@mx-space/kami-design/components/Portal/provider'

import { useIsMountedState } from '~/hooks/use-is-mounted'

import { BottomUpTransitionView } from '../Transition/bottom-up'
import styles from './modal.module.css'
import { ScaleModalTransition } from './scale-transition'

export interface ModalProps {
  title?: string
  closeable?: boolean
  onClose?: () => any
  modalClassName?: string
  contentClassName?: string
  noBlur?: boolean
  fixedWidth?: boolean
  useRootPortal?: boolean
}

export type ModalRefObject = {
  dismiss: () => Promise<void>
  getElement: () => HTMLElement
  forceUpdate: () => void
}
export const Modal = forwardRef<
  ModalRefObject,
  ModalProps & {
    modalId: string
    useBottomDrawerInMobile: boolean
    disposer: () => void
    getIsMobileViewport: () => boolean
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
      props.onClose && props.onClose()
    })
  }, [props.disposer])

  const $wrapper = useRef<HTMLDivElement>(null)
  const forceUpdate = useState({})[1]

  useImperativeHandle(ref, () => ({
    dismiss,
    getElement: () => {
      return $wrapper.current as HTMLElement
    },
    forceUpdate() {
      forceUpdate({})
    },
  }))

  const { title, closeable, modalId, useRootPortal, getIsMobileViewport } =
    props
  const useDrawerStyle = getIsMobileViewport() && props.useBottomDrawerInMobile

  const isMounted = useIsMountedState()

  const Content = (
    <div
      className={clsx(
        styles['content'],
        title && styles['has-title'],
        props.contentClassName,
      )}
    >
      {props.children}
    </div>
  )

  const Children = (
    <div
      id={modalId}
      ref={$wrapper}
      className={clsx(
        styles['modal'],
        props.fixedWidth && styles['fixed-width'],
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
        <div className={styles['close-btn']} onClick={dismiss} role={'button'}>
          <CloseIcon />
        </div>
      )}
      {useRootPortal ? (
        isMounted ? (
          <RootPortalProvider value={{ to: $wrapper.current as HTMLElement }}>
            {Content}
          </RootPortalProvider>
        ) : null
      ) : (
        Content
      )}
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
})
