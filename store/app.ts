import {} from '@fortawesome/free-brands-svg-icons'
import configs from 'configs'
import { action, computed, observable } from 'mobx'
import { Seo } from 'models/aggregate'
import { MenuModel, PageModel, ViewportRecord } from './types'

export default class AppStore {
  @observable menu: MenuModel[] = configs.menu as MenuModel[]
  @observable viewport: Partial<ViewportRecord> = {}
  @observable loading = false
  @observable position = 0

  @observable config = { seo: {} as Seo } as any

  @action updatePosition() {
    if (typeof document !== 'undefined') {
      this.position = document.documentElement.scrollTop
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
  @action UpdateViewport() {
    this.viewport = {
      w: document.documentElement.getBoundingClientRect().width,
      h: window.innerHeight,
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
