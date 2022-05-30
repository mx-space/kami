import { useEffect } from 'react'

import { useStore } from '~/store'

export const useScreenMedia = () => {
  const { appStore: app } = useStore()

  // initMediaListener
  useEffect(() => {
    const getMediaType = <T extends { matches: boolean }>(e: T) => {
      app.mediaType = e.matches ? 'screen' : 'print'
      return app.mediaType
    }

    getMediaType(window.matchMedia('screen'))

    const callback = (e: MediaQueryListEvent): void => {
      getMediaType(e)
    }
    try {
      window.matchMedia('screen').addEventListener('change', callback)
      // eslint-disable-next-line no-empty
    } catch {}

    return () => {
      window.matchMedia('screen').removeEventListener('change', callback)
    }
  }, [])
}
