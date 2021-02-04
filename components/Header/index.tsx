/*
 * @Author: Innei
 * @Date: 2021-02-03 20:33:57
 * @LastEditTime: 2021-02-04 11:33:52
 * @LastEditors: Innei
 * @FilePath: /web/components/Header/index.tsx
 * @Mark: Coding with Love
 */
import React, { FC, useMemo, useRef } from 'react'
import scss from './index.module.scss'
import css from './index.module.css'
import classNames from 'classnames'
import { combineClassName } from 'utils'
import { CustomLogo as Logo } from 'components/Logo'
import { observer } from 'mobx-react-lite'
import { useInitialData } from 'common/context/InitialDataContext'
import { useRouter } from 'next/router'
import { useStore } from 'common/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListUl } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
const styles = combineClassName(css, scss)

export const _Header: FC = observer(() => {
  const {
    seo: { title },
  } = useInitialData()
  const router = useRouter()
  const { appStore, userStore } = useStore()

  const ballIndex = useMemo(() => {
    const asPath = router.asPath
    console.log(asPath)

    if (asPath === '' || asPath === '/') {
      return 0
    }
    const firstPath = asPath.split('/')[1]
    console.log(firstPath)

    switch (firstPath) {
      case 'posts': {
        return 1
      }
      case 'notes': {
        return 2
      }
      case 'says': {
        return 3
      }
      case 'timeline': {
        return 4
      }
      case 'friends': {
        return 5
      }
    }
  }, [router])

  console.log(ballIndex)
  const groupRef = useRef<HTMLUListElement>(null)

  const ballOffsetLeft = useMemo(() => {
    if (!groupRef.current || typeof ballIndex === 'undefined') {
      return
    }
    const $group = groupRef.current
    const $child = $group.children
      .item(ballIndex)
      ?.children.item(0) as HTMLElement
    console.log($child)

    return $child.offsetLeft + $child.getBoundingClientRect().width / 2
  }, [ballIndex, groupRef.current])
  console.log(ballOffsetLeft)

  return (
    <header className={classNames(styles['header'], 'header-top-navbar')}>
      <nav
        className={classNames(
          styles['nav-container'],
          appStore.headerNav.show &&
            appStore.scrollDirection == 'down' &&
            appStore.isOverFirstScreenHalfHeight
            ? styles['toggle']
            : null,
        )}
      >
        <div className={classNames(styles['head-swiper'], 'justify-between')}>
          <div className={'flex items-center justify-center'}>
            <div
              className={styles['header-logo']}
              onClick={() => {
                appStore?.viewport.mobile ? router.push('/') : null
              }}
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

          <div className={styles['more-button']}>
            <FontAwesomeIcon icon={faListUl} />
          </div>
          <ul className={styles['link-group']} ref={groupRef}>
            {appStore.menu.map((m) => {
              const isFontAwesomeIconDefine =
                m.icon && m.icon.icon && m.icon.prefix && m.icon.iconName

              return (
                <Link href={m.path} key={m.title}>
                  <a>
                    <li className={styles['link-item']}>
                      {isFontAwesomeIconDefine && (
                        <FontAwesomeIcon icon={m.icon!} />
                      )}
                      <span className={styles['link-title']}>{m.title}</span>
                    </li>
                  </a>
                </Link>
              )
            })}

            {typeof ballOffsetLeft === 'number' && !isNaN(ballOffsetLeft) && (
              <div
                className={styles['anchor-ball']}
                style={{ left: ballOffsetLeft + 'px' }}
              ></div>
            )}
          </ul>
        </div>
        <div className={classNames(styles['head-swiper'], 'justify-between')}>
          <div className={styles['head-info']}>
            <div className={styles['desc']}>
              <div className={styles['meta']}>{appStore.headerNav.meta}</div>
              <div className={styles['title']}>{appStore.headerNav.title}</div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
})

const Header = dynamic(() => Promise.resolve(_Header), { ssr: true })
export default Header
