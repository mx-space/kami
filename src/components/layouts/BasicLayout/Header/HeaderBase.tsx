import { clsx } from 'clsx'
import type { FC } from 'react'
import React, { useDeferredValue } from 'react'

import { useAppStore } from '~/atoms/app'
import { useIsOverFirstScreenHeight } from '~/hooks/ui/use-viewport'

import styles from './index.module.css'

export const useHeaderOpacity = () => {
  const threshold = 50
  const position = useDeferredValue(
    useAppStore(({ position }) =>
      position >= threshold
        ? 1
        : Math.floor((position / threshold) * 100) / 100,
    ),
  )

  return position
}

export const HeaderBase: FC<{ children?: React.ReactNode }> = (props) => {
  const headerOpacity = useHeaderOpacity()
  const isOverFirstScreenHeight = useIsOverFirstScreenHeight()
  const isMobile = useAppStore((state) => state.viewport.mobile)

  return (
    <header
      className={clsx(
        styles['header'],
        // !appStore.headerNav.show &&
        isOverFirstScreenHeight && isMobile ? styles['hide'] : null,
      )}
      style={
        {
          '--opacity': headerOpacity,
        } as any
      }
    >
      {props.children}
    </header>
  )
}
