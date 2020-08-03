import { QueueAnim } from 'components/Anime'
import { FC } from 'react'
import ReactDOM from 'react-dom'
import styles from './index.module.scss'

interface OverLayProps {
  onClose: () => void
}

const _OverLay: FC<OverLayProps> = ({ children, onClose }) => {
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

export const OverLay: FC<OverLayProps> = (props) => {
  return ReactDOM.createPortal(
    <QueueAnim>
      <_OverLay {...props} key={'real'} />
    </QueueAnim>,
    document.body,
  )
}
