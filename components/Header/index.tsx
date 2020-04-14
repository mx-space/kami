import { inject, observer } from 'mobx-react'
import React from 'react'
import AppStore from 'store/app'
import { Stores, MenuModel } from 'store/types'
import UserStore from 'store/user'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
interface store {
  app?: AppStore
  master?: UserStore
}

@inject((store: Stores) => ({ app: store.appStore, master: store.userStore }))
@observer
export default class Header extends React.Component<store> {
  componentDidMount() {
    this.props.master?.fetchUser()
  }

  renderSubMenu(subMenu: MenuModel[]) {
    const menus = subMenu.map((menu) => {
      return (
        <Link href={menu.path} key={menu._id}>
          <a>{menu.title}</a>
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
              <div className={item.subMenu ? 'has-child' : 'menu-link'}>
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
      </header>
    )
  }
}
