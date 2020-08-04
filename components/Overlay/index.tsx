import { QueueAnim, TweenOne } from 'components/Anime'
import { FC, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { isServerSide } from 'utils'
import styles from './index.module.scss'

interface OverLayProps {
  onClose: () => void
}

const _OverLay: FC<OverLayProps> = ({ children, onClose }) => {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])
  return (
    <div className={styles['container']}>
      <QueueAnim type="alpha">
        <div
          className={styles['overlay']}
          onClick={onClose}
          key="overlay"
        ></div>
      </QueueAnim>
      {children}
    </div>
  )
}

export const OverLay: FC<OverLayProps & { show: boolean }> = ({
  show,
  ...props
}) => {
  if (isServerSide()) {
    return null
  }
  return ReactDOM.createPortal(
    <QueueAnim type={'alpha'} leaveReverse duration={500} forcedReplay>
      {show ? <_OverLay {...props} key={'real'} /> : null}
    </QueueAnim>,
    document.body,
  )
}
