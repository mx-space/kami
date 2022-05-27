import type { FC } from 'react'

import { RootPortal } from '../Portal'
import { FadeInOutTransitionView } from '../Transition/fade-in-out'
import styles from './index.module.css'

interface NoticePanelProps {
  icon: JSX.Element
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
              <div className={styles['icon']}>{icon}</div>
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

export const NoticePanel: FC<
  NoticePanelProps & { in: boolean; onExited: () => any }
> = (props) => {
  if (typeof document === 'undefined') {
    return null
  }

  return (
    <RootPortal>
      <FadeInOutTransitionView
        in={props.in}
        timeout={{ exit: 500 }}
        appear
        unmountOnExit
        onEntered={() => {
          setTimeout(() => {
            props.onExited()
          }, 3000)
        }}
      >
        <_Notice {...props} />
      </FadeInOutTransitionView>
    </RootPortal>
  )
}
