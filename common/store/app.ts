import configs from 'configs'
import { action, computed, observable } from 'mobx'
import { Seo } from 'models/aggregate'
import { CategoryModel } from '../../models/category'
import { MenuModel, PageModel, ViewportRecord } from './types'

export default class AppStore {
  @observable menu: MenuModel[] = configs.menu as MenuModel[]
  @observable viewport: Partial<ViewportRecord> = {}
  @observable loading = true
  @observable position = 0
  @observable scrollDirection: 'up' | 'down' | null = null

  @observable autoToggleColorMode = true
  @observable colorMode: 'light' | 'dark' = 'light'
  @observable config = { seo: {} as Seo } as any

  @observable headerNav = {
    title: '',
    meta: '',
    show: false,
  }
  @observable noteNid: null | number = null

  @action updatePosition(direction: 'up' | 'down') {
    if (typeof document !== 'undefined') {
      this.position = document.documentElement.scrollTop
      this.scrollDirection = direction
    }
  }

  @computed get isOverflow() {
    if (typeof window === 'undefined') {
      return false
    }
    return this.position > window.innerHeight || this.position > screen.height
  }

  @action toggleLoading() {
    document.body.classList.toggle('loading')
    this.loading = !this.loading
  }
  @action setLoading(state: boolean) {
    state
      ? document.body.classList.add('loading')
      : document.body.classList.remove('loading')
    this.loading = state
  }
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
        path: '/[page]',
        as: '/' + slug,
        type: 'Page',
      }
    })

    homeMenu?.subMenu!.push(...models)
  }

  @action setCategories(categories: CategoryModel[]) {
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

  @action updateViewport() {
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
  @action setConfig(config: any) {
    this.config = config
  }

  @action setLastestNoteNid(nid: number) {
    this.noteNid = nid
  }

  @computed get seo() {
    return this.config.seo || {}
  }
  @computed get title() {
    return this.seo?.title || configs.title || 'MX-space'
  }
  @computed get description() {
    return this.seo.description
  }
}
