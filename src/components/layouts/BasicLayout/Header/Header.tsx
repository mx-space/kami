import classNames from 'clsx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { IcBaselineMenuOpen } from '~/components/universal/Icons'
import { CustomLogo as Logo } from '~/components/universal/Logo'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useInitialData } from '~/hooks/use-initial-data'
import { useIsClient } from '~/hooks/use-is-client'
import { useSingleAndDoubleClick } from '~/hooks/use-single-double-click'
import { useStore } from '~/store'

import { HeaderActionBasedOnRouterPath } from './HeaderActionBasedOnRouterPath'
import { HeaderDrawer } from './HeaderDrawer'
import { HeaderDrawerNavigation } from './HeaderDrawerNavigation'
import { MenuList } from './HeaderMenuList'
import styles from './index.module.css'

export const Header: FC = observer(() => {
  const {
    seo: { title },
  } = useInitialData()
  const { appStore } = useStore()

  const { isPadOrMobile } = appStore

  const router = useRouter()
  const { event } = useAnalyze()
  const clickFunc = useSingleAndDoubleClick(
    () => {
      router.push('/')

      event({
        action: TrackerAction.Click,
        label: '点击 - 顶部 Logo',
      })
    },
    () => void router.push('/login'),
  )

  const [drawerOpen, setDrawerOpen] = useState(false)
  const showPageHeader = useMemo(
    () =>
      appStore.headerNav.show &&
      (appStore.scrollDirection == 'down' || appStore.viewport.mobile) &&
      appStore.isOverPostTitleHeight,
    [
      appStore.headerNav.show,
      appStore.isOverPostTitleHeight,
      appStore.scrollDirection,
      appStore.viewport.mobile,
    ],
  )
  // NOTE: fix `tab` focus element lead to header dislocation
  const appHeaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    appHeaderRef.current?.scrollIntoView()
  }, [showPageHeader])

  const MemoComponent = useMemo(
    () => (
      <div
        className={classNames(
          styles['head-swiper'],
          styles['swiper-metawrapper'],
          'flex justify-between truncate',
        )}
      >
        <div className={styles['head-info']}>
          <div className={styles['desc']}>
            <div className={styles['meta']}>{appStore.headerNav.meta}</div>
            <div className={styles['title']}>{appStore.headerNav.title}</div>
          </div>
        </div>
        <div className={styles['right-wrapper']}>
          <HeaderActionBasedOnRouterPath />
        </div>
      </div>
    ),
    [appStore.headerNav.meta, appStore.headerNav.title],
  )
  const isClient = useIsClient()
  if (!isClient) {
    return null
  }

  return (
    <>
      <header
        className={classNames(
          styles['header'],
          !appStore.headerNav.show &&
            appStore.isOverFirstScreenHeight &&
            appStore.viewport.mobile
            ? styles['hide']
            : null,
        )}
      >
        <nav
          className={classNames(
            styles['nav-container'],
            'overflow-hidden',
            showPageHeader ? styles['toggle'] : null,
          )}
        >
          <div
            className={classNames(styles['head-swiper'], 'justify-between')}
            ref={appHeaderRef}
          >
            <div
              className={
                'flex items-center justify-center cursor-pointer select-none'
              }
              onClick={clickFunc}
            >
              <div className={styles['header-logo']}>
                <Logo />
              </div>
              <h1 className={styles['title']}>{title}</h1>
            </div>

            <div
              className={styles['more-button']}
              onClick={() => {
                setDrawerOpen(true)
              }}
            >
              <IcBaselineMenuOpen className="text-2xl" />
            </div>
            <MenuList />
          </div>
          {MemoComponent}
        </nav>
        {isPadOrMobile && (
          <HeaderDrawer
            show={drawerOpen}
            onExit={() => {
              setDrawerOpen(false)
            }}
          >
            <HeaderDrawerNavigation />
          </HeaderDrawer>
        )}
      </header>
    </>
  )
})
