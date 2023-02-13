import { clsx } from 'clsx'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useCallback, useMemo } from 'react'
import { Modifier, useShortcut } from 'react-shortcut-guide'
import { TransitionGroup } from 'react-transition-group'

import {
  BxBxsArrowToTop,
  FaSolidHeadphonesAlt,
  SubscribeOutlined,
} from '@mx-space/kami-design/components/Icons/for-footer'
import { RootPortal } from '@mx-space/kami-design/components/Portal'
import { ScaleTransitionView } from '@mx-space/kami-design/components/Transition/scale'

import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useStore } from '~/store'
import { springScrollToTop } from '~/utils/spring'

import styles from './actions.module.css'

const timeout = { exit: 300 }
export const FooterActions: FC = observer(() => {
  const { appStore, actionStore, musicStore, subscribeStore } = useStore()
  const {
    isOverFirstScreenHeight: isOverflow,
    isPadOrMobile,
    scrollDirection,
  } = appStore

  const shouldHideActionButtons = useMemo(() => {
    if (!isPadOrMobile) {
      return false
    }

    return isOverflow && scrollDirection == 'down'
  }, [isOverflow, isPadOrMobile, scrollDirection])

  const { event } = useAnalyze()
  const toTop = useCallback(() => {
    springScrollToTop()
    event({
      action: TrackerAction.Click,
      label: '底部点击回到顶部',
    })
  }, [])

  const handlePlayMusic = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: `底部播放器点击`,
    })
    runInAction(() => {
      musicStore.setHide(!musicStore.isHide)
      musicStore.setPlay(!musicStore.isHide)
    })
  }, [])

  const handleSubscribe = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: `底部订阅点击`,
    })
    runInAction(() => {
      subscribeStore.setHide(!subscribeStore.isHide)
    })
  }, [])

  useShortcut(
    'P',
    [Modifier.Command, Modifier.Shift],
    handlePlayMusic,
    '播放音乐',
  )

  return (
    <RootPortal>
      <div
        className={clsx(
          styles.action,
          shouldHideActionButtons && styles['hidden'],
        )}
      >
        <button
          aria-label="to top"
          className={clsx(styles['top'], isOverflow ? styles['active'] : '')}
          onClick={toTop}
        >
          <BxBxsArrowToTop />
        </button>
        <TransitionGroup>
          {actionStore.actions.map((action) => {
            const El = action.element ?? (
              <button
                aria-label="footer action button"
                onClick={action.onClick}
              >
                {action.icon}
              </button>
            )

            return (
              <ScaleTransitionView
                key={action.id}
                unmountOnExit
                timeout={timeout}
              >
                {El}
              </ScaleTransitionView>
            )
          })}
        </TransitionGroup>

        <button aria-label="subscribe" onClick={handleSubscribe}>
          <SubscribeOutlined />
        </button>
        <button aria-label="open player" onClick={handlePlayMusic}>
          <FaSolidHeadphonesAlt />
        </button>
      </div>
    </RootPortal>
  )
})
