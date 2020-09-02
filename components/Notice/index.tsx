import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TweenOne from 'rc-tween-one'
import type { IAnimObject } from 'rc-tween-one/typings/AnimObject'
import { FC } from 'react'
import ReactDOM from 'react-dom'
import styles from './index.module.scss'
interface NoticePanelProps {
  icon: IconDefinition
  text: string | JSX.Element
}

const _Notice: FC<NoticePanelProps> = (props) => {
  const { icon, text } = props
  return (
    <div className={styles['f-wrap']}>
      <div className={styles['mask']}>
        <div className={styles['notice-darwin']}>
          <div className={styles['box']}>
            <div className={styles['icon-wrap']}>
              <div className={styles['icon']}>
                <FontAwesomeIcon icon={icon} />
              </div>
            </div>

            <div className={styles['notice-text']}>
              <span>{text}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const NoticePanel: FC<NoticePanelProps & { setShow: Function }> = (
  props,
) => {
  if (typeof document === 'undefined') {
    return null
  }
  const animation: IAnimObject[] = [
    {
      opacity: 0,
    },
    { opacity: 1 },
    { opacity: 1, duration: 3000 },
    {
      opacity: 0,
      onComplete: () => {
        props.setShow(false)
      },
    },
  ]
  return ReactDOM.createPortal(
    <TweenOne animation={animation} paused={false} style={{ opacity: 0 }}>
      <_Notice {...props} />
    </TweenOne>,
    document.body,
  )
}
