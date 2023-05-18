import type { FC } from 'react'
import { useCallback, useEffect, useRef } from 'react'

import { RootPortal } from '~/components/ui/Portal'
import { FadeInOutTransitionView } from '~/components/ui/Transition/FadeInOutTransitionView'
import { useIsClient } from '~/hooks/common/use-is-client'

import styles from './index.module.css'

interface NoticePanelProps {
  icon: JSX.Element
  text: string | JSX.Element
}

const Notice: FC<NoticePanelProps> = (props) => {
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
  NoticePanelProps & { in: boolean; onExited: () => any; duration?: number }
> = (props) => {
  const isClient = useIsClient()

  const timerRef = useRef<any>()

  const handleWantoDisappear = useCallback(() => {
    timerRef.current = clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      props.onExited()
    }, props.duration || 3000)
  }, [props])

  useEffect(() => {
    timerRef.current = clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      handleWantoDisappear()
    }, props.duration || 3000)
  }, [props, handleWantoDisappear])

  if (!isClient) {
    return null
  }

  return (
    <RootPortal>
      <FadeInOutTransitionView
        in={props.in}
        timeout={{ exit: 500 }}
        appear
        useAnimatePresence
        onEntered={handleWantoDisappear}
      >
        <Notice {...props} />
      </FadeInOutTransitionView>
    </RootPortal>
  )
}
