import { observable, computed, action } from 'mobx'
import { MenuModel } from './types'

import { faHome } from '@fortawesome/free-solid-svg-icons'
import {} from '@fortawesome/fontawesome-svg-core'

export default class AppStore {
  @observable menu: MenuModel[] = [
    {
      _id: '1',
      title: '主页',
      type: 'Home',
      path: '/',
      icon: faHome,
      subMenu: [
        {
          _id: '1-1',
          title: '关于',
          type: 'Home',
          path: '/about',
        },
      ],
    },
    {
      _id: '2',
      title: '博文',
      type: 'Post',
      path: '/posts',
    },
    {
      _id: '3',
      title: '日记',
      type: 'Note',
      path: '/notes',
    },
  ]
  @observable title = 'MX-space'

  @action setMenu(menu: MenuModel[]) {
    this.menu = menu
  }
}
