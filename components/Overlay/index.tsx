/*
 * @Author: Innei
 * @Date: 2020-09-17 14:02:24
 * @LastEditTime: 2021-02-04 14:13:50
 * @LastEditors: Innei
 * @FilePath: /web/components/Overlay/index.tsx
 * @Mark: Coding with Love
 */
import classNames from 'classnames'
import { QueueAnim } from 'components/Anime'
import dynamic from 'next/dynamic'
import { FC, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { isServerSide } from 'utils'
import styles from './index.module.scss'

interface OverLayProps {
  onClose: () => void
  center?: boolean
}

const _OverLay: FC<OverLayProps> = ({ children, onClose, center }) => {
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
