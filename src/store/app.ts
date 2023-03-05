import { makeAutoObservable } from 'mobx'

import type { ViewportRecord } from './types'

export default class AppUIStore {
  constructor() {
    makeAutoObservable(this)
  }

  viewport: ViewportRecord = {} as any

  private position = 0
  scrollDirection: 'up' | 'down' | null = null

  colorMode: 'light' | 'dark' = 'light'
  mediaType: 'screen' | 'print' = 'screen'

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
      hpad: window.innerWidth <= 1100 && window.innerWidth > 768,
      wider: window.innerWidth > 1100 && window.innerWidth < 1920,
      widest: window.innerWidth >= 1920,
    }
  }

  get isPadOrMobile() {
    return this.viewport.pad || this.viewport.mobile
  }

  /**
   * < 1100
   */
  get isNarrowThanLaptop() {
    return this.isPadOrMobile || this.viewport.hpad
  }
}
