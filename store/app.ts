import {} from '@fortawesome/free-brands-svg-icons'
import {
  faBook,
  faFlask,
  faHome,
  faMusic,
  faPen,
  faStar,
  faTv,
} from '@fortawesome/free-solid-svg-icons'
import { action, observable } from 'mobx'
import { MenuModel, PageModel } from './types'
import { model } from 'mobx-state-tree/dist/types/complex-types/model'

export default class AppStore {
  @observable menu: MenuModel[] = [
    {
      _id: '1',
      title: '主页',
      type: 'Home',
      path: '/',
      icon: faHome,
      subMenu: [],
    },
    {
      _id: '2',
      title: '博文',
      type: 'Post',
      path: '/posts',
      icon: faBook,
    },
    {
      _id: '3',
      title: '日记',
      type: 'Note',
      path: '/notes',
      icon: faPen,
    },
    {
      _id: '4',
      title: '项目',
      icon: faFlask,
      path: '/project',
      type: 'Project',
    },
    {
      _id: '5',
      title: '兴趣',
      icon: faStar,
      path: '/music',
      type: 'Custom',
      subMenu: [
        {
          _id: '5-1',
          title: '音乐',
          icon: faMusic,
          path: '/music',
          type: 'Music',
        },
        {
          _id: '5-2',
          title: '追番',
          icon: faTv,
          path: 'bangumi',
          type: 'Bangumi',
        },
      ],
    },
  ]
  @observable title = 'MX-space'

  @action setMenu(menu: MenuModel[]) {
    this.menu = menu
  }

  @action setPage(pages: PageModel[]) {
    const homeMenu = this.menu.find((menu) => menu.type === 'Home')
    const models: MenuModel[] = pages.map((page) => {
      const { title, _id, slug } = page
      return {
        title,
        _id,
        path: '/' + slug,
        type: 'Page',
      }
    })
    homeMenu?.subMenu!.push(...models)
  }
}
