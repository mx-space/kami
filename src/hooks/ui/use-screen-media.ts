import { startTransition, useEffect } from 'react'

import { useAppStore } from '~/atoms/app'

export const useScreenMedia = () => {
  // initMediaListener
  useEffect(() => {
    const getMediaType = <T extends { matches: boolean }>(e: T) => {
      const mediaType = e.matches ? 'screen' : 'print'
      startTransition(() => {
        useAppStore.getState().setMedia(mediaType)
      })
      return mediaType
    }

    setTimeout(() => {
      getMediaType(window.matchMedia('screen'))
    }, 0)

    const callback = (e: MediaQueryListEvent): void => {
      getMediaType(e)
    }
    try {
      window.matchMedia('screen').addEventListener('change', callback)
       
    } catch {}

    return () => {
      window.matchMedia('screen').removeEventListener('change', callback)
    }
  }, [])
}
