import { clsx } from 'clsx'
import type { FC } from 'react'
import React from 'react'

import type { AppStore } from '~/atoms/app'
import type { StoreType } from '~/atoms/store'
import { useJotaiStore } from '~/atoms/store'
import { useIsOverFirstScreenHeight } from '~/hooks/use-viewport'

import styles from './index.module.css'

export const useHeaderOpacity = (appStore: StoreType<AppStore>) => {
  const { position } = appStore
  const threshold = 50
  return position >= threshold
    ? 1
    : Math.floor((position / threshold) * 100) / 100
}

export const HeaderBase: FC<{ children?: React.ReactNode }> = (props) => {
  const appStore = useJotaiStore('app')
  const headerOpacity = useHeaderOpacity(appStore)
  const isOverFirstScreenHeight = useIsOverFirstScreenHeight(appStore)

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
