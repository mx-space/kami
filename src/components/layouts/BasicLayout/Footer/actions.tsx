import { clsx } from 'clsx'
import { AnimatePresence, Reorder } from 'framer-motion'
import type { FC } from 'react'
import React, { useCallback, useDeferredValue, useMemo } from 'react'
import { Modifier, useShortcut } from 'react-shortcut-guide'
import { shallow } from 'zustand/shallow'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { useMusicStore } from '~/atoms/music'
import {
  BxBxsArrowToTop,
  FaSolidHeadphonesAlt,
} from '~/components/ui/Icons/for-footer'
import { RootPortal } from '~/components/ui/Portal'
import { ScaleTransitionView } from '~/components/ui/Transition/scale'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import {
  useDetectPadOrMobile,
  useIsOverFirstScreenHeight,
} from '~/hooks/ui/use-viewport'
import { springScrollToTop } from '~/utils/spring'

import styles from './actions.module.css'

const noop = () => void 0

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
        <Reorder.Group values={actions} onReorder={noop}>
          <AnimatePresence>
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
                <Reorder.Item layout value={action} key={action.id}>
                  <ScaleTransitionView duration={0.3}>{El}</ScaleTransitionView>
                </Reorder.Item>
              )
            })}
          </AnimatePresence>
        </Reorder.Group>

        <button aria-label="open player" onClick={handlePlayMusic}>
          <FaSolidHeadphonesAlt />
        </button>
      </FooterActionsBase>
    </RootPortal>
  )
}
