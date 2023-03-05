import type { ViewportRecord } from '~/store/types'

import { BaseStore } from './base'

interface AppAtom {
  viewport: ViewportRecord
  position: number
  scrollDirection: 'up' | 'down' | null
  colorMode: 'light' | 'dark'
  mediaType: 'screen' | 'print'
}

const appDefault: AppAtom = {
  colorMode: 'light',
  mediaType: 'screen',
  position: 0,
  scrollDirection: null,
  viewport: {} as any,
}

export class AppStore extends BaseStore<AppAtom> {
  default = Object.freeze(appDefault)

  constructor() {
    super(appDefault)

    this.updatePosition = this.updatePosition.bind(this)
    this.setColorMode = this.setColorMode.bind(this)
    this.updateViewport = this.updateViewport.bind(this)
  }

  updatePosition(direction: 'up' | 'down' | null, y: number) {
    if (typeof document !== 'undefined') {
      this.setAtomValue('position', y)
      this.setAtomValue('scrollDirection', direction)
    }
  }

  updateViewport() {
    const innerHeight = window.innerHeight
    const width = document.documentElement.getBoundingClientRect().width

    this.setAtomValue('viewport', (viewport) => {
      const { hpad, pad, mobile } = viewport

      // 忽略移动端浏览器 上下滚动 导致的视图大小变化
      if (
        viewport.h &&
        // chrome mobile delta == 56
        Math.abs(innerHeight - viewport.h) < 80 &&
        width === viewport.w &&
        (hpad || pad || mobile)
      ) {
        return viewport
      }
      return {
        w: width,
        h: innerHeight,
        mobile: window.screen.width <= 568 || window.innerWidth <= 568,
        pad: window.innerWidth <= 768 && window.innerWidth > 568,
        hpad: window.innerWidth <= 1100 && window.innerWidth > 768,
        wider: window.innerWidth > 1100 && window.innerWidth < 1920,
        widest: window.innerWidth >= 1920,
      }
    })
  }

  setColorMode(colorMode: 'light' | 'dark') {
    this.setAtomValue('colorMode', colorMode)
  }
}
