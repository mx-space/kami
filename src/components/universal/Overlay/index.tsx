import classNames from 'clsx'
import { merge } from 'lodash-es'
import { CSSProperties, FC, memo, ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { isServerSide } from 'utils'
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
}

const __OverLay: FC<OverlayProps> = ({ show, ...props }) => {
  if (isServerSide()) {
    return null
  }

  return ReactDOM.createPortal(
    <FadeInOutTransitionView in={show} unmountOnExit timeout={{ exit: 500 }}>
      <_OverLay {...props} child={props.children}></_OverLay>
    </FadeInOutTransitionView>,
    document.body,
  )
}
export const OverLay = memo(__OverLay)
