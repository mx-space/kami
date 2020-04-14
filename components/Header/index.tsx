import { inject, observer } from 'mobx-react'
import React from 'react'
import AppStore from 'store/app'
import { Stores, MenuModel } from 'store/types'
import UserStore from 'store/user'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './index.module.scss'
import SocialStore from 'store/social'

interface store {
  app?: AppStore
  master?: UserStore
  links?: SocialStore
}

@inject((store: Stores) => ({
  app: store.appStore,
  master: store.userStore,
  links: store.socialStore,
}))
@observer
export default class Header extends React.Component<store> {
  componentDidMount() {
    this.props.master?.fetchUser()
  }

  renderSubMenu(subMenu: MenuModel[]) {
    const menus = subMenu.map((menu) => {
      return (
        <Link href={menu.path} key={menu._id}>
          <a>
            {menu.icon && <FontAwesomeIcon icon={menu.icon} />}
            <span>{menu.title}</span>
          </a>
        </Link>
      )
    })
    return <div className="sub-menu">{menus}</div>
  }

  render() {
    const app = this.props.app
    const { menu } = app || {}
    return (
      <header>
        <div className="head-toggle"></div>
        <div className="head-logo">
          <svg viewBox="0 0 200 200"></svg>
        </div>
        <nav className="head-menu">
          {menu?.map((item: MenuModel) => {
            return (
              <div
                className={item.subMenu ? 'has-child' : 'menu-link'}
                key={item._id}
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
              <Link href={link.url}>
                <a title={link.title}>
                  <FontAwesomeIcon icon={link.icon} />
                </a>
              </Link>
            )
          })}
        </nav>
      </header>
    )
  }
}
