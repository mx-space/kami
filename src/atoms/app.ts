import { create } from 'zustand'

import type { ViewportRecord } from '~/store/types'

interface AppState {
  viewport: ViewportRecord
  position: number
  scrollDirection: 'up' | 'down' | null
  colorMode: 'light' | 'dark'
  mediaType: 'screen' | 'print'
}

interface AppAction {
  updatePosition(direction: 'up' | 'down' | null, y: number): void
  updateViewport(): void
  setColorMode(colorMode: 'light' | 'dark'): void
}

const appDefault: AppState = {
  colorMode: 'light',
  mediaType: 'screen',
  position: 0,
  scrollDirection: null,
  viewport: {} as any,
}

export const useAppStore = create<AppState & AppAction>((set, get) => {
  return {
    ...appDefault,

    setColorMode(colorMode) {
      set({ colorMode })
    },
    updatePosition(direction, y) {
      set({ position: y, scrollDirection: direction })
    },
    updateViewport() {
      const innerHeight = window.innerHeight
      const width = document.documentElement.getBoundingClientRect().width
      const viewport = get().viewport

      const { hpad, pad, mobile } = viewport

      // 忽略移动端浏览器 上下滚动 导致的视图大小变化
      if (
        viewport.h &&
        // chrome mobile delta == 56
        Math.abs(innerHeight - viewport.h) < 80 &&
        width === viewport.w &&
        (hpad || pad || mobile)
      ) {
        set({ viewport })
        return
      }

      set({
        viewport: {
          w: width,
          h: innerHeight,
          mobile: window.screen.width <= 568 || window.innerWidth <= 568,
          pad: window.innerWidth <= 768 && window.innerWidth > 568,
          hpad: window.innerWidth <= 1100 && window.innerWidth > 768,
          wider: window.innerWidth > 1100 && window.innerWidth < 1920,
          widest: window.innerWidth >= 1920,
        },
      })
    },
  }
})
