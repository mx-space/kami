import { faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Logo } from 'components/Logo'
import { inject, observer } from 'mobx-react'
import Link from 'next/link'
import React, { MouseEvent } from 'react'
import AppStore from 'store/app'
import SocialStore from 'store/social'
import { MenuModel, Stores } from 'store/types'
import UserStore from 'store/user'
import PageStore from '../../store/pages'

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
      <header className={this.state.menuOpen ? 'active' : ''}>
        <style jsx>{`
          .head-logo {
            display: flex;
            align-items: center;
          }
          @media screen and (max-width: 600px) {
            .head-logo {
              display: block;
            }
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

        <div className="head-logo">
          <Logo />
        </div>
        <nav className="head-menu">
          {menu?.map((item: MenuModel) => {
            return (
              <div
                className={item.subMenu ? 'has-child' : 'menu-link'}
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
