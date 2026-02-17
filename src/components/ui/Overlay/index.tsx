import { clsx } from 'clsx'
import merge from 'lodash-es/merge'
import type { CSSProperties, FC, ReactNode } from 'react'
import React, { memo, useEffect, useState } from 'react'

import { RootPortal } from '~/components/ui/Portal'
import { useIsClient } from '~/hooks/common/use-is-client'
import { isUndefined } from '~/utils/_'
import { stopEventDefault } from '~/utils/dom'

import { FadeInOutTransitionView } from '../Transition/FadeInOutTransitionView'
import styles from './index.module.css'

interface OverLayProps {
  onClose: () => void
  center?: boolean
  darkness?: number
  blur?: boolean
  zIndex?: number
  stopPropagation?: boolean
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
    center = true,
    darkness,
    standaloneWrapperClassName,
    zIndex,
    stopPropagation,
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

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])

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
            useAnimatePresence
            onExited={() => setIsExitAnimationEnd(true)}
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
          <div
            onClick={(e) => {
              if (stopPropagation) e.stopPropagation()
              else stopEventDefault(e)
            }}
            tabIndex={-1}
          >
            {props.children}
          </div>
        </div>
      )}
    </RootPortal>
  )
}

export const Overlay = memo(OverLay)
