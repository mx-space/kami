import { clsx } from 'clsx'
import type { FC } from 'react'
import React, { useCallback, useDeferredValue, useMemo } from 'react'
import { Modifier, useShortcut } from 'react-shortcut-guide'
import { TransitionGroup } from 'react-transition-group'
import { shallow } from 'zustand/shallow'

import {
  BxBxsArrowToTop,
  FaSolidHeadphonesAlt,
} from '@mx-space/kami-design/components/Icons/for-footer'
import { RootPortal } from '@mx-space/kami-design/components/Portal'
import { ScaleTransitionView } from '@mx-space/kami-design/components/Transition/scale'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { useMusicStore } from '~/atoms/music'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import {
  useDetectPadOrMobile,
  useIsOverFirstScreenHeight,
} from '~/hooks/use-viewport'
import { springScrollToTop } from '~/utils/spring'

import styles from './actions.module.css'

const timeout = { exit: 300 }

const FooterActionsBase: FC<{
  children?: React.ReactNode
}> = (props) => {
  const isOverFirstScreenHeight = useIsOverFirstScreenHeight()

  const isPadOrMobile = useDetectPadOrMobile()
  const { scrollDirection } = useAppStore(
    (state) => ({
      scrollDirection: state.scrollDirection,
    }),
    shallow,
  )

  const shouldHideActionButtons = useMemo(() => {
    if (!isPadOrMobile) {
      return false
    }

    return isOverFirstScreenHeight && scrollDirection == 'down'
  }, [isOverFirstScreenHeight, isPadOrMobile, scrollDirection])

  const { event } = useAnalyze()

  const toTop = useCallback(() => {
    springScrollToTop()
    event({
      action: TrackerAction.Click,
      label: '底部点击回到顶部',
    })
  }, [])

  return (
    <div
      className={clsx(
        styles.action,
        shouldHideActionButtons && styles['hidden'],
      )}
    >
      <button
        aria-label="to top"
        className={clsx(
          styles['top'],
          isOverFirstScreenHeight ? styles['active'] : '',
        )}
        onClick={toTop}
      >
        <BxBxsArrowToTop />
      </button>

      {props.children}
    </div>
  )
}

export const FooterActions: FC = () => {
  const { event } = useAnalyze()

  const handlePlayMusic = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: `底部播放器点击`,
    })
    const musicStore = useMusicStore.getState()
    const nextStatus = !musicStore.isHide
    musicStore.setHide(nextStatus)
    musicStore.setPlay(!nextStatus)
  }, [])

  useShortcut(
    'P',
    [Modifier.Command, Modifier.Shift],
    handlePlayMusic,
    '播放音乐',
  )

  const actions = useDeferredValue(useActionStore((state) => state.actions))

  return (
    <RootPortal>
      <FooterActionsBase>
        <TransitionGroup>
          {actions.map((action) => {
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
        <button aria-label="open player" onClick={handlePlayMusic}>
          <FaSolidHeadphonesAlt />
        </button>
      </FooterActionsBase>
    </RootPortal>
  )
}
