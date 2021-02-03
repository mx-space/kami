/*
 * @Author: Innei
 * @Date: 2021-02-03 20:33:57
 * @LastEditTime: 2021-02-03 21:39:13
 * @LastEditors: Innei
 * @FilePath: /web/components/Header/index.tsx
 * @Mark: Coding with Love
 */
import React, { FC } from 'react'
import scss from './index.module.scss'
import css from './index.module.css'
import classNames from 'classnames'
import { combineClassName } from 'utils'
import { DefaultLogo as Logo } from 'components/Logo'
import { observer } from 'mobx-react-lite'
import { useInitialData } from 'common/context/InitialDataContext'
import { useRouter } from 'next/router'
import { useStore } from 'common/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListUl } from '@fortawesome/free-solid-svg-icons'
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
            className={styles['head-logo']}
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
      </nav>
    </header>
  )
})

export default Header
