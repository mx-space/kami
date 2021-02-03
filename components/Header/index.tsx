/*
 * @Author: Innei
 * @Date: 2021-02-03 20:33:57
 * @LastEditTime: 2021-02-03 22:11:00
 * @LastEditors: Innei
 * @FilePath: /web/components/Header/index.tsx
 * @Mark: Coding with Love
 */
import React, { FC } from 'react'
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
const styles = combineClassName(css, scss)

export const Header: FC = observer(() => {
  const {
    seo: { title },
  } = useInitialData()
  const router = useRouter()
  const { appStore, userStore } = useStore()
  return (
    <header className={classNames(styles['header'], 'header-top-navbar')}>
      <nav>
        <div className={styles['head-swiper']}>
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
        <ul className={styles['link-group']}>
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
        </ul>
      </nav>
    </header>
  )
})

export default Header
