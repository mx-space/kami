import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'
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
import { ScaleTransitionView } from '~/components/ui/Transition/ScaleTransitionView'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import {
  useDetectPadOrMobile,
  useIsOverFirstScreenHeight,
} from '~/hooks/ui/use-viewport'
import { springScrollToTop } from '~/utils/spring'

import styles from './actions.module.css'

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

const FooterActionButton: FC<
  PropsWithChildren<{ onClick?: () => any; label?: string }>
> = ({ children, onClick, label }) => {
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      whileTap={{
        scale: 0.9,
      }}
      whileHover={{
        scale: 1.05,
      }}
    >
      {children}
    </motion.button>
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
        <AnimatePresence>
          {actions.map((action) => {
            const El = action.element ?? (
              <FooterActionButton
                aria-label="footer action button"
                onClick={action.onClick}
              >
                {action.icon}
              </FooterActionButton>
            )

            return (
              <ScaleTransitionView
                layoutId={action.id}
                layout
                duration={0.3}
                key={action.id}
              >
                {El}
              </ScaleTransitionView>
            )
          })}
        </AnimatePresence>

        <FooterActionButton aria-label="open player" onClick={handlePlayMusic}>
          <FaSolidHeadphonesAlt />
        </FooterActionButton>
      </FooterActionsBase>
    </RootPortal>
  )
}
