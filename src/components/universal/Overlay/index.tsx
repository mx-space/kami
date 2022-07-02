import clsx from 'clsx'
import { isUndefined, merge } from 'lodash-es'
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

const _OverLay: FC<OverLayProps & { child: any }> = (props) => {
  const { onClose, center, darkness, blur = false, zIndex } = props

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <div
      className={clsx(styles['container'], center && styles['center'])}
      style={typeof zIndex != 'undefined' ? { zIndex } : undefined}
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
      ></div>

      {props.child}
    </div>
  )
}

export type OverlayProps = OverLayProps & {
  show: boolean
  children?: ReactNode
  /** 子代节点独立于 Overlay 内部 */
  childrenOutside?: boolean

  zIndex?: number

  standaloneWrapperClassName?: string
}

const __OverLay: FC<OverlayProps> = ({
  show,
  childrenOutside = false,
  ...props
}) => {
  const isClient = useIsClient()

  const [isExitAnimationEnd, setIsExitAnimationEnd] = useState(!show)

  useEffect(() => {
    if (show) {
      setIsExitAnimationEnd(false)
    }
  }, [show])

  if (!isClient) {
    return null
  }

  return (
    <RootPortal>
      <FadeInOutTransitionView
        in={show}
        onExited={() => setIsExitAnimationEnd(true)}
        unmountOnExit
        timeout={{ exit: 500 }}
      >
        <_OverLay
          {...props}
          child={childrenOutside ? null : props.children}
        ></_OverLay>
      </FadeInOutTransitionView>
      {!isExitAnimationEnd && childrenOutside && (
        <div
          className={clsx(
            'z-99 fixed inset-0 flex',
            props.center && 'items-center justify-center',
            props.standaloneWrapperClassName,
          )}
          tabIndex={-1}
          onClick={props.onClose}
          style={
            typeof props.zIndex != 'undefined'
              ? {
                  zIndex: props.zIndex,
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

__OverLay.defaultProps = {
  center: true,
}
export const OverLay = memo(__OverLay)
