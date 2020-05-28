import { faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DefaultLogo as Logo } from 'components/Logo'
import { inject, observer } from 'mobx-react'
import Link from 'next/link'
import React, { MouseEvent } from 'react'
import AppStore from 'store/app'
import SocialStore from 'store/social'
import { MenuModel, Stores } from 'store/types'
import UserStore from 'store/user'
import PageStore from '../../store/pages'
import styles from './index.module.scss'
import classNames from 'classnames'
import Router from 'next/router'

interface Store {
  app?: AppStore
  master?: UserStore
  links?: SocialStore
  pages?: PageStore
}

@inject((store: Stores) => ({
  app: store.appStore,
  master: store.userStore,
  links: store.socialStore,
  pages: store.pageStore,
}))
@observer
export default class Header extends React.Component<Store> {
  state = {
    menuOpen: false,
  }

  renderSubMenu(subMenu: MenuModel[]) {
    const menus = subMenu.map((menu) => {
      return (
        <Link href={menu.path} as={menu.as} key={menu._id}>
          <a onClick={this.closeMenu}>
            {menu.icon && <FontAwesomeIcon icon={menu.icon} />}
            <span>{menu.title}</span>
          </a>
        </Link>
      )
    })
    return <div className="sub-menu">{menus}</div>
  }

  closeMenu = (e: MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
    if (this.props.app?.viewport.mobile) {
      e.stopPropagation()
      this.setState({
        menuOpen: false,
      })
    }
  }

  render() {
    const app = this.props.app
    const { menu } = app || {}
    return (
      <header
        className={classNames(
          this.state.menuOpen ? 'active' : '',
          this.props.app?.viewport.mobile &&
            this.props.app.scrollDirection == 'down' &&
            this.props.app.isOverflow
            ? 'hide'
            : null,
        )}
        style={{
          backdropFilter:
            this.state.menuOpen && this.props.app?.viewport.mobile
              ? 'unset'
              : undefined,
        }}
      >
        <style jsx>{`
          .head-logo {
            display: flex;
            align-items: center;
          }
          header {
            background-color: var(--light-bg-opacity);
            backdrop-filter: blur(25px) brightness(1.2);
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
          @media screen and (prefers-color-scheme: dark) {
            :root:not(.white) header {
              backdrop-filter: blur(25px) brightness(0.5);
            }
          }
          html.dark header {
            backdrop-filter: blur(25px) brightness(0.5);
          }
        `}</style>
        {app?.viewport.mobile && (
          <div
            onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
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
            this.props.app?.viewport.mobile ? Router.push('/') : null
          }}
        >
          <Logo />
        </div>
        <div
          className={classNames(
            styles['head-swiper'],
            app?.headerNav.show &&
              app.scrollDirection == 'down' &&
              app.isOverflow
              ? styles['toggle']
              : null,
          )}
        >
          <nav className={styles['head-info']}>
            <div className={styles['desc']}>
              <div className={styles['meta']}>{app?.headerNav.meta}</div>
              <div className={styles['title']}>{app?.headerNav.title}</div>
            </div>
          </nav>
          <nav className={classNames('head-menu', styles['head-menu'])}>
            {menu?.map((item: MenuModel) => {
              return (
                <div
                  className={
                    item.subMenu && item.subMenu.length > 0
                      ? 'has-child'
                      : 'menu-link'
                  }
                  key={item._id}
                  onClick={this.closeMenu}
                >
                  <Link href={item.path} as={item.path}>
                    <a>
                      {item.icon && <FontAwesomeIcon icon={item.icon} />}
                      <span>{item.title}</span>
                    </a>
                  </Link>
                  {item.subMenu && this.renderSubMenu(item.subMenu)}
                </div>
              )
            })}
          </nav>
        </div>

        <nav className="head-social">
          {this.props.links?.socialLinks.map((link) => {
            return (
              <a title={link.title} href={link.url} key={link.url}>
                <FontAwesomeIcon icon={link.icon} />
              </a>
            )
          })}
        </nav>
      </header>
    )
  }
}
