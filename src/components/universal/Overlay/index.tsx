import classNames from 'clsx'
import { QueueAnim } from 'components/universal/Anime'
import { merge } from 'lodash-es'
import { CSSProperties, FC, memo, ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { isServerSide } from 'utils'
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
      <QueueAnim type="alpha">
        <div
          className={styles['overlay']}
          style={merge<Partial<CSSProperties>, Partial<CSSProperties>>(
            darkness ? { backgroundColor: `rgba(0,0,0,${darkness})` } : {},
            blur ? { backdropFilter: 'blur(5px)' } : {},
          )}
          onClick={onClose}
          key="overlay"
        ></div>
      </QueueAnim>
      {props.child}
    </div>
  )
}

const __OverLay: FC<OverLayProps & { show: boolean; children: ReactNode }> = ({
  show,
  ...props
}) => {
  if (isServerSide()) {
    return null
  }

  return ReactDOM.createPortal(
    <QueueAnim type={'alpha'} leaveReverse duration={500} forcedReplay>
      {show ? (
        <_OverLay {...props} child={props.children} key={'real'}></_OverLay>
      ) : null}
    </QueueAnim>,
    document.body,
  )
}
export const OverLay = memo(__OverLay)
