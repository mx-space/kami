import { faListUl, faRoute } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { DefaultLogo as Logo } from 'components/Logo'
import Link from 'next/link'
import Router from 'next/router'
import React, {
  FC,
  Fragment,
  memo,
  MouseEvent,
  useCallback,
  useState,
} from 'react'
import { observer } from 'utils/mobx'
import { useStore } from '../../common/store'
import { MenuModel } from '../../common/store/types'
import configs from '../../configs'
import styles from './index.module.scss'
const SubMenu: FC<{ subMenu: MenuModel[]; onClick: any }> = observer(
  ({ subMenu, onClick }) => {
    const menus = subMenu.map((menu) => {
      return (
        <Link href={menu.path} as={menu.as} key={menu.title}>
          <a onClick={onClick}>
            {menu.icon && <FontAwesomeIcon icon={menu.icon} />}
            <span>{menu.title}</span>
          </a>
        </Link>
      )
    })
    return <div className="sub-menu">{menus}</div>
  },
)
const NavItems: FC<{ onClick: any }> = observer(({ onClick }) => {
  const { appStore } = useStore()
  const { menu } = appStore
  return (
    <>
      {menu.map((item: MenuModel) => {
        return (
          <div
            className={
              item.subMenu && item.subMenu.length > 0
                ? 'has-child'
                : 'menu-link'
            }
            key={item.title}
            onClick={onClick}
          >
            <Link href={item.path} as={item.path}>
              <a>
                {item.icon && <FontAwesomeIcon icon={item.icon} />}
                <span>{item.title}</span>
              </a>
            </Link>
            {item.subMenu && (
              <SubMenu subMenu={item.subMenu} onClick={onClick} />
            )}
          </div>
        )
      })}
    </>
  )
})

const Links: FC = observer(() => {
  const { socialStore } = useStore()
  return (
    <Fragment>
      {socialStore.socialLinks.map((link) => {
        return (
          <a title={link.title} href={link.url} key={link.url}>
            <FontAwesomeIcon icon={link.icon} />
          </a>
        )
      })}
      {configs.travellings && (
        <a href="https://travellings.now.sh/" target={'_blank'} title="开往">
          <FontAwesomeIcon icon={faRoute} />
        </a>
      )}
    </Fragment>
  )
})
const Header: FC = observer(() => {
  const { appStore } = useStore()

  const isMobile = appStore.viewport.mobile
  const [menuOpen, setMenu] = useState(false)
  const closeMenu = useCallback(
    (e: MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      if (appStore.viewport.mobile) {
        e.stopPropagation()
        setMenu(false)
      }
    },
    [appStore.viewport.mobile],
  )

  return (
    <header
      className={classNames(
        menuOpen ? 'active' : '',
        isMobile && appStore.scrollDirection == 'down' && appStore.isOverflow
          ? 'hide'
          : null,
      )}
      style={{
        backdropFilter: isMobile ? 'unset' : undefined,
        backgroundColor: isMobile ? 'var(--light-bg)' : undefined,
      }}
    >
      <style jsx>{`
        .head-logo {
          display: flex;
          align-items: center;
        }
        header {
          background-color: var(--bg-opacity);
          backdrop-filter: blur(25px) saturate(150%) brightness(1.1);
          z-index: 5;
          transition: transform 0.5s, backdrop-filter 0.5s;
        }
        header.hide {
          transform: translateY(-100%);
        }
        @media screen and (max-width: 600px) {
          .head-logo {
            display: block;
          }
        }

        html.dark header {
          backdrop-filter: saturate(150%) blur(30px);
        }
      `}</style>
      {appStore.viewport.mobile && (
        <div
          onClick={() => {
            setMenu(!menuOpen)
          }}
          className="head-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1em',
            cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon icon={faListUl} />
        </div>
      )}

      <div
        className="head-logo"
        onClick={() => {
          appStore?.viewport.mobile ? Router.push('/') : null
        }}
      >
        <Logo />
      </div>
      <div
        className={classNames(
          styles['head-swiper'],
          appStore.headerNav.show &&
            appStore.scrollDirection == 'down' &&
            appStore.isOverflow
            ? styles['toggle']
            : null,
        )}
      >
        <nav className={styles['head-info']}>
          <div className={styles['desc']}>
            <div className={styles['meta']}>{appStore.headerNav.meta}</div>
            <div className={styles['title']}>{appStore.headerNav.title}</div>
          </div>
        </nav>
        <nav className={classNames('head-menu', styles['head-menu'])}>
          <NavItems onClick={closeMenu} />
        </nav>
      </div>

      <nav className="head-social">
        <Links />
      </nav>
    </header>
  )
})
export default memo(Header)
