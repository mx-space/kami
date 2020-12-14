import configs from 'configs'
import { makeAutoObservable } from 'mobx'
import { Seo } from 'models/aggregate'
import { CategoryModel } from '../../models/category'
import { MenuModel, PageModel, ViewportRecord } from './types'

export default class AppStore {
  constructor() {
    makeAutoObservable(this)
  }
  menu: MenuModel[] = configs.menu as MenuModel[]
  viewport: Partial<ViewportRecord> = {}

  position = 0
  scrollDirection: 'up' | 'down' | null = null

  autoToggleColorMode = true
  colorMode: 'light' | 'dark' = 'light'
  config = { seo: {} as Seo }

  headerNav = {
    title: '',
    meta: '',
    show: false,
  }
  noteNid: null | number = null

  updatePosition(direction: 'up' | 'down') {
    if (typeof document !== 'undefined') {
      this.position = document.documentElement.scrollTop
      this.scrollDirection = direction
    }
  }

  get isOverflow() {
    if (typeof window === 'undefined') {
      return false
    }
    return this.position > window.innerHeight || this.position > screen.height
  }

  setMenu(menu: MenuModel[]) {
    this.menu = menu
  }

  setPage(pages: PageModel[]) {
    const homeMenu = this.menu.find((menu) => menu.type === 'Home')
    const models: MenuModel[] = pages.map((page) => {
      const { title, _id, slug } = page
      return {
        title,
        _id,
        path: '/[page]',
        as: '/' + slug,
        type: 'Page',
      }
    })

    homeMenu?.subMenu!.push(...models)
  }

  setCategories(categories: CategoryModel[]) {
    const postMenu = this.menu.find((menu) => menu.type === 'Post')
    const models: MenuModel[] = categories.map((category) => {
      const { _id, slug, name } = category
      return {
        title: name,
        _id,
        path: '/category/[slug]',
        as: '/category/' + slug,
        type: 'Custom',
      }
    })
    postMenu?.subMenu!.push(...models)
  }

  updateViewport() {
    const innerHeight = window.innerHeight
    const width = document.documentElement.getBoundingClientRect().width
    const { hpad, pad, mobile } = this.viewport

    // 忽略移动端浏览器 上下滚动 导致的视图大小变化
    if (
      this.viewport.h &&
      // chrome mobile delta == 56
      Math.abs(innerHeight - this.viewport.h) < 80 &&
      width === this.viewport.w &&
      (hpad || pad || mobile)
    ) {
      return
    }
    this.viewport = {
      w: width,
      h: innerHeight,
      mobile: window.screen.width <= 568 || window.innerWidth <= 568,
      pad: window.innerWidth <= 768 && window.innerWidth > 568,
      hpad: window.innerWidth <= 1024 && window.innerWidth > 768,
      wider: window.innerWidth > 1024 && window.innerWidth < 1920,
      widest: window.innerWidth >= 1920,
    }
  }
  setConfig(config: any) {
    this.config = config
  }

  setLastestNoteNid(nid: number) {
    this.noteNid = nid
  }

  get seo() {
    return this.config.seo || {}
  }
  get title() {
    return this.seo.title || 'MX-space'
  }
  get description() {
    return this.seo.description
  }

  get isPadOrMobile() {
    return this.viewport.pad || this.viewport.mobile
  }
}
