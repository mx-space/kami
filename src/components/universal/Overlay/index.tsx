import { clsx } from 'clsx'
import isUndefined from 'lodash-es/isUndefined'
import merge from 'lodash-es/merge'
import type { CSSProperties, FC, ReactNode } from 'react'
import { memo, useEffect, useState } from 'react'

import { useIsClient } from '~/hooks/use-is-client'
import { stopEventDefault } from '~/utils/dom'

import { RootPortal } from '../Portal'
import { FadeInOutTransitionView } from '../Transition/fade-in-out'
import styles from './index.module.css'

interface OverLayProps {
  onClose: () => void
  center?: boolean
  darkness?: number
  blur?: boolean
  zIndex?: number
}

export type OverlayProps = OverLayProps & {
  show: boolean
  children?: ReactNode

  zIndex?: number

  standaloneWrapperClassName?: string
}

const OverLay: FC<OverlayProps> = (props) => {
  const {
    onClose,
    show,
    blur,
    center,

    darkness,
    standaloneWrapperClassName,
    zIndex,
  } = props
  const isClient = useIsClient()

  const [isExitAnimationEnd, setIsExitAnimationEnd] = useState(!show)

  useEffect(() => {
    if (show) {
      setIsExitAnimationEnd(false)
    }
  }, [show])

  useEffect(() => {
    document.documentElement.style.overflow = show ? 'hidden' : ''
  }, [show])

  if (!isClient) {
    return null
  }

  return (
    <RootPortal>
      {!isExitAnimationEnd && (
        <div
          className={clsx(styles['container'], center && styles['center'])}
          style={typeof zIndex != 'undefined' ? { zIndex } : undefined}
        >
          <FadeInOutTransitionView
            in={show}
            onExited={() => setIsExitAnimationEnd(true)}
            unmountOnExit
            timeout={{ exit: 500 }}
          >
            <div
              className={styles['overlay']}
              style={merge<Partial<CSSProperties>, Partial<CSSProperties>>(
                !isUndefined(darkness)
                  ? { backgroundColor: `rgba(0,0,0,${darkness})` }
                  : {},
                blur ? { backdropFilter: 'blur(5px)' } : {},
              )}
              onClick={onClose}
            />
          </FadeInOutTransitionView>
        </div>
      )}

      {!isExitAnimationEnd && (
        <div
          className={clsx(
            'z-99 fixed inset-0 flex',
            props.center && 'items-center justify-center',
            standaloneWrapperClassName,
          )}
          tabIndex={-1}
          onClick={props.onClose}
          style={
            typeof props.zIndex != 'undefined'
              ? {
                  zIndex: props.zIndex + 1,
                }
              : undefined
          }
        >
          <div onClick={stopEventDefault} tabIndex={-1}>
            {props.children}
          </div>
        </div>
      )}
    </RootPortal>
  )
}

OverLay.defaultProps = {
  center: true,
}
export const Overlay = memo(OverLay)
