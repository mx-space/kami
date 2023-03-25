import { create } from 'zustand'

import { apiClient } from '~/utils/client'

import { useUserStore } from './user'

// import './dev'

export interface ViewportRecord {
  w: number
  h: number
  mobile: boolean
  pad: boolean
  hpad: boolean
  wider: boolean
  widest: boolean
}
interface AppState {
  viewport: ViewportRecord
  position: number
  scrollDirection: 'up' | 'down' | null
  colorMode: 'light' | 'dark'
  mediaType: 'screen' | 'print'

  gatewayOnline: number

  appUrl: UrlConfig | null
}

interface AppAction {
  updatePosition(direction: 'up' | 'down' | null, y: number): void
  updateViewport(): void
  setColorMode(colorMode: 'light' | 'dark'): void

  setMedia(type: 'screen' | 'print'): void
  fetchUrl(): Promise<void>
}

export interface UrlConfig {
  adminUrl: string
  backendUrl: string

  frontendUrl: string
}

const appDefault: AppState = {
  colorMode: 'light',
  mediaType: 'screen',
  position: 0,
  scrollDirection: null,
  viewport: {} as any,

  gatewayOnline: 0,

  appUrl: null,
}

export const useAppStore = create<AppState & AppAction>(
  (setState, getState) => {
    return {
      ...appDefault,

      setColorMode(colorMode) {
        setState({ colorMode })
      },
      updatePosition(direction, y) {
        setState({
          position: y,
          scrollDirection: direction ?? getState().scrollDirection,
        })
      },
      updateViewport() {
        const innerHeight = window.innerHeight
        const width = document.documentElement.getBoundingClientRect().width
        const viewport = getState().viewport

        const { hpad, pad, mobile } = viewport

        // 忽略移动端浏览器 上下滚动 导致的视图大小变化
        if (
          viewport.h &&
          // chrome mobile delta == 56
          Math.abs(innerHeight - viewport.h) < 80 &&
          width === viewport.w &&
          (hpad || pad || mobile)
        ) {
          setState({ viewport })
          return
        }

        setState({
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
      setMedia(type) {
        setState({ mediaType: type })
      },
      async fetchUrl() {
        const isLogged = useUserStore.getState().isLogged
        if (!isLogged) {
          return
        }
        const { data } = await apiClient.proxy.options.url.get<{
          data: UrlConfig
        }>()

        setState({ appUrl: data })
      },
    }
  },
)
