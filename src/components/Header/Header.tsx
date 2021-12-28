import { faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'clsx'
import { useInitialData } from 'common/hooks/use-initial-data'
import { useStore } from 'common/store'
import { CustomLogo as Logo } from 'components/Logo'
import { observer } from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, useMemo, useState } from 'react'
import { HeaderActionBasedOnRouterPath } from './HeaderActionBasedOnRouterPath'
import { HeaderDrawer } from './HeaderDrawer'
import { HeaderDrawerNavigation } from './HeaderDrawerNavigation'
import { HeaderFake, MenuList } from './HeaderMenuList'
import styles from './index.module.css'

export const _Header: FC = observer(() => {
  const {
    seo: { title },
  } = useInitialData()
  const { appStore, userStore } = useStore()

  const router = useRouter()

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header
        className={classNames(
          styles['header'],
          'header-top-navbar',
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
            appStore.headerNav.show &&
              (appStore.scrollDirection == 'down' ||
                appStore.viewport.mobile) &&
              appStore.isOverPostTitleHeight
              ? styles['toggle']
              : null,
          )}
        >
          <div className={classNames(styles['head-swiper'], 'justify-between')}>
            <div
              className={
                'flex items-center justify-center cursor-pointer select-none'
              }
              onDoubleClick={() => void router.push('/login')}
              onClick={() => {
                router.push('/')
              }}
            >
              <div
                className={styles['header-logo']}
                onDoubleClick={() => {
                  if (!userStore.isLogged) {
                    router.push('/login')
                  }
                }}
              >
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
              <FontAwesomeIcon icon={faListUl} />
            </div>
            <MenuList />
          </div>
          {useMemo(
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
                    <div className={styles['meta']}>
                      {appStore.headerNav.meta}
                    </div>
                    <div className={styles['title']}>
                      {appStore.headerNav.title}
                    </div>
                  </div>
                </div>
                <div className={styles['right-wrapper']}>
                  <HeaderActionBasedOnRouterPath />
                </div>
              </div>
            ),
            [appStore.headerNav.meta, appStore.headerNav.title],
          )}
        </nav>
        <HeaderDrawer
          show={drawerOpen}
          onExit={() => {
            setDrawerOpen(false)
          }}
        >
          <HeaderDrawerNavigation />
        </HeaderDrawer>
      </header>
      <HeaderFake />
    </>
  )
})
export const Header = dynamic(() => Promise.resolve(_Header), { ssr: false })
