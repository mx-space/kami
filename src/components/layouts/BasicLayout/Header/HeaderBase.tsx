import { clsx } from 'clsx'
import type { FC } from 'react'
import React from 'react'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '~/atoms/app'
import { useIsOverFirstScreenHeight } from '~/hooks/use-viewport'

import styles from './index.module.css'

export const useHeaderOpacity = () => {
  const position = useAppStore((state) => state.position)

  const threshold = 50
  return position >= threshold
    ? 1
    : Math.floor((position / threshold) * 100) / 100
}

export const HeaderBase: FC<{ children?: React.ReactNode }> = (props) => {
  const headerOpacity = useHeaderOpacity()
  const isOverFirstScreenHeight = useIsOverFirstScreenHeight()
  const appStore = useAppStore(
    (state) => ({
      viewport: state.viewport,
    }),
    shallow,
  )
  return (
    <header
      className={clsx(
        styles['header'],
        // !appStore.headerNav.show &&
        isOverFirstScreenHeight && appStore.viewport.mobile
          ? styles['hide']
          : null,
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
