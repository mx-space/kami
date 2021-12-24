import { useStore } from 'common/store'
import { useEffect } from 'react'

export const useMediaToggle = () => {
  const { appStore: app } = useStore()
  // initMediaListener
  useEffect(() => {
    const getColormode = <T extends { matches: boolean }>(e: T) => {
      app.colorMode = e.matches ? 'dark' : 'light'
      return app.colorMode
    }

    const getMediaType = <T extends { matches: boolean }>(e: T) => {
      app.mediaType = e.matches ? 'screen' : 'print'
      return app.mediaType
    }
    getColormode(window.matchMedia('(prefers-color-scheme: dark)'))
    getMediaType(window.matchMedia('screen'))
    const cb1 = (e: MediaQueryListEvent): void => {
      if (app.autoToggleColorMode) {
        getColormode(e)
      }
    }
    const cb2 = (e: MediaQueryListEvent): void => {
      getMediaType(e)
    }
    try {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', cb1)

      window.matchMedia('screen').addEventListener('change', cb2)
      // eslint-disable-next-line no-empty
    } catch {}

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', cb1)
      window.matchMedia('screen').removeEventListener('change', cb2)
    }
  }, [])
}
