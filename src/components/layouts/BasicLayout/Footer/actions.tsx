import classNames from 'clsx'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import { Modifier, useShortcut } from 'react-shortcut-guide'
import { TransitionGroup } from 'react-transition-group'

import {
  BxBxsArrowToTop,
  FaSolidHeadphonesAlt,
} from '~/components/universal/Icons'
import { RootPortal } from '~/components/universal/Portal'
import { ScaleTransitionView } from '~/components/universal/Transition/scale'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useStore } from '~/store'
import { springScrollToTop } from '~/utils/spring'

import styles from './actions.module.css'

// TODO chat panel
export const FooterActions: FC = observer(() => {
  const { appStore, actionStore, musicStore } = useStore()
  const { isOverFirstScreenHeight: isOverflow } = appStore

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

  useShortcut(
    'P',
    [Modifier.Command, Modifier.Shift],
    handlePlayMusic,
    '播放音乐',
  )

  return (
    <RootPortal>
      <div className={styles.action}>
        <button
          aria-label="to top"
          className={classNames(
            styles['top'],
            isOverflow ? styles['active'] : '',
          )}
          onClick={toTop}
        >
          <BxBxsArrowToTop />
        </button>
        <TransitionGroup>
          {actionStore.actions.map((action, i) => {
            return (
              <ScaleTransitionView
                key={i}
                unmountOnExit
                timeout={{ exit: 300 }}
              >
                <button
                  aria-label="footer action button"
                  onClick={action.onClick}
                >
                  {action.icon}
                </button>
              </ScaleTransitionView>
            )
          })}
        </TransitionGroup>

        <button aria-label="open player" onClick={handlePlayMusic}>
          <FaSolidHeadphonesAlt />
        </button>
      </div>
    </RootPortal>
  )
})
