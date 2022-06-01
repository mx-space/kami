import classNames from 'clsx'
import { merge } from 'lodash-es'
import type { CSSProperties, FC, ReactNode } from 'react'
import { memo, useEffect } from 'react'
import { stopEventDefault } from 'utils'

import { useIsClient } from '~/hooks/use-is-client'

import { RootPortal } from '../Portal'
import { FadeInOutTransitionView } from '../Transition/fade-in-out'
import styles from './index.module.css'

interface OverLayProps {
  onClose: () => void
  center?: boolean
  darkness?: number
  blur?: boolean
}

const _OverLay: FC<OverLayProps & { child: any }> = (props) => {
  const { onClose, center, darkness, blur = false } = props

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <div
      className={classNames(styles['container'], center && styles['center'])}
    >
      <div
        key="overlay"
        className={styles['overlay']}
        style={merge<Partial<CSSProperties>, Partial<CSSProperties>>(
          darkness ? { backgroundColor: `rgba(0,0,0,${darkness})` } : {},
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
}

const __OverLay: FC<OverlayProps> = ({
  show,
  childrenOutside = false,
  ...props
}) => {
  const isClient = useIsClient()
  if (!isClient) {
    return null
  }

  return (
    <RootPortal>
      <FadeInOutTransitionView
        className="z-30"
        in={show}
        unmountOnExit
        timeout={{ exit: 500 }}
      >
        <_OverLay
          {...props}
          child={childrenOutside ? null : props.children}
        ></_OverLay>
      </FadeInOutTransitionView>
      {show && childrenOutside && (
        <div
          className="z-99 fixed inset-0 flex items-center justify-center"
          tabIndex={-1}
          onClick={props.onClose}
        >
          <div onClick={stopEventDefault} tabIndex={-1}>
            {props.children}
          </div>
        </div>
      )}
    </RootPortal>
  )
}
export const OverLay = memo(__OverLay)
