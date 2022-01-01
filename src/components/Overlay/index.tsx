import classNames from 'clsx'
import { QueueAnim } from 'components/Anime'
import { merge } from 'lodash-es'
import dynamic from 'next/dynamic'
import { CSSProperties, FC, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styles from './index.module.css'

interface OverLayProps {
  onClose: () => void
  center?: boolean
  darkness?: number
  blur?: boolean
}

const _OverLay: FC<OverLayProps> = ({
  children,
  onClose,
  center,
  darkness,
  blur = false,
}) => {
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
      {children}
    </div>
  )
}

const __OverLay: FC<OverLayProps & { show: boolean }> = ({
  show,
  ...props
}) => {
  return ReactDOM.createPortal(
    <QueueAnim type={'alpha'} leaveReverse duration={500} forcedReplay>
      {show ? <_OverLay {...props} key={'real'} /> : null}
    </QueueAnim>,
    document.body,
  )
}
export const OverLay = dynamic(() => Promise.resolve(__OverLay), { ssr: false })