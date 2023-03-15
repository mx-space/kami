import { useEffect } from 'react'

import { useAppStore } from '~/atoms/app'

export const useScreenMedia = () => {
  // initMediaListener
  useEffect(() => {
    const getMediaType = <T extends { matches: boolean }>(e: T) => {
      const mediaType = e.matches ? 'screen' : 'print'
      useAppStore.getState().setMedia(mediaType)
      return mediaType
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
