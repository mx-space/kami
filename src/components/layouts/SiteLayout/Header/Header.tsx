import { clsx as classNames } from 'clsx'
import type { FC } from 'react'

import { useRouter } from '~/i18n/navigation'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '~/atoms/app'
import { useIsLogged } from '~/atoms/user'
import { CustomLogo as Logo } from '~/components/common/Logo'
import { IcBaselineMenuOpen } from '~/components/ui/Icons/layout'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useGetHeaderMeta } from '~/hooks/app/use-header-meta'
import { useInitialData, useKamiConfig } from '~/hooks/app/use-initial-data'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useSingleAndDoubleClick } from '~/hooks/common/use-single-double-click'
import { useIsOverPostTitleHeight } from '~/hooks/ui/use-viewport'

import { HeaderActionBasedOnRouterPath } from './HeaderActionBasedOnRouterPath'
import { HeaderBase } from './HeaderBase'
import { HeaderDrawer } from './HeaderDrawer'
import { HeaderDrawerNavigation } from './HeaderDrawerNavigation'
import { MenuList } from './HeaderMenuList'
import styles from './index.module.css'

export const Header: FC = () => {
  const {
    seo: { title, description },
  } = useInitialData()
  const {
    site: { subtitle },
  } = useKamiConfig()
  const isLogged = useIsLogged()

  const headerNav = useGetHeaderMeta()

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
    () => {
      const url = useAppStore.getState().appUrl
      if (isLogged && url?.adminUrl) {
        location.href = url.adminUrl
      } else {
        router.push('/login')
      }
    },
  )

  const [drawerOpen, setDrawerOpen] = useState(false)
  const appStore = useAppStore(
    (state) => ({
      scrollDirection: state.scrollDirection,
      viewport: state.viewport,
    }),
    shallow,
  )
  const isOverPostTitleHeight = useIsOverPostTitleHeight()
  const showPageHeader = useMemo(
    () =>
      headerNav.show &&
      (appStore.scrollDirection == 'down' || appStore.viewport.mobile) &&
      isOverPostTitleHeight,
    [
      headerNav.show,
      isOverPostTitleHeight,
      appStore.scrollDirection,
      appStore.viewport.mobile,
    ],
  )

  // NOTE: fix `tab` focus element lead to header dislocation
  const appHeaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    appHeaderRef.current?.scrollIntoView()
  }, [showPageHeader])

  const isClient = useIsClient()

  const headerSubTitle = subtitle || description || ''

  // const headerSubTitle = ''
  if (!isClient) {
    return null
  }
  return (
    <HeaderBase>
      <nav
        className={classNames(
          styles['nav-container'],
          'overflow-hidden',
          showPageHeader ? styles['toggle'] : null,
        )}
      >
        <div
          className={classNames(
            styles['head-swiper'],
            'min-w-0 justify-between',
          )}
          ref={appHeaderRef}
        >
          <div
            className="flex min-w-0 cursor-pointer select-none items-center justify-center"
            onClick={clickFunc}
          >
            <div className={styles['header-logo']}>
              <Logo />
            </div>
            <div className={styles['header-title-wrapper']}>
              <h1
                className={classNames(
                  styles['title'],
                  headerSubTitle && styles['title-has-sub'],
                )}
              >
                {title}
              </h1>
              {headerSubTitle && (
                <h2 className={styles['subtitle']}>{headerSubTitle}</h2>
              )}
            </div>
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
        <HeaderMetaTitle title={headerNav.title} meta={headerNav.meta} />
      </nav>

      <HeaderDrawer
        show={drawerOpen}
        onExit={() => {
          setDrawerOpen(false)
        }}
      >
        <HeaderDrawerNavigation />
      </HeaderDrawer>
    </HeaderBase>
  )
}

const HeaderMetaTitle: FC<{
  title: string
  meta: string
}> = memo((props) => {
  const { title, meta } = props
  return (
    <div
      className={classNames(
        styles['head-swiper'],
        styles['swiper-metawrapper'],
        'flex justify-between truncate',
      )}
    >
      <div className={styles['head-info']}>
        <div className={styles['desc']}>
          <div className={styles['meta']}>{meta}</div>
          <div className={styles['title']}>{title}</div>
        </div>
      </div>
      <div className={styles['right-wrapper']}>
        <HeaderActionBasedOnRouterPath />
      </div>
    </div>
  )
})
