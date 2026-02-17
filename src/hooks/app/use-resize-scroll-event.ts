import debounce from 'lodash-es/debounce'
import throttle from 'lodash-es/throttle'
import { startTransition, useEffect, useMemo, useRef } from 'react'

import { useAppStore } from '~/atoms/app'

export const useResizeScrollEvent = () => {
  const _currentY = useRef(0)

  const appStore = useMemo(() => useAppStore.getState(), [])

  useEffect(() => {
    startTransition(() => {
      appStore.updateViewport()
    })

    const handleScroll = throttle(
      () => {
        const currentY = document.documentElement.scrollTop
        const shouldUpdateDirection =
          Math.abs(_currentY.current - currentY) > 100

        if (shouldUpdateDirection) {
          const direction = _currentY.current > currentY ? 'up' : 'down'
          appStore.updatePosition(direction, currentY)

          _currentY.current = currentY
        } else {
          appStore.updatePosition(appStore.scrollDirection, currentY)
        }
      },
      16,
      { leading: false },
    )

    const resizeHandler = debounce(
      () => {
        appStore.updateViewport()
      },
      500,
      { leading: true },
    )
    window.onresize = resizeHandler

    if (typeof document !== 'undefined') {
      document.addEventListener('scroll', handleScroll)
    }
    return () => {
      window.onresize = null
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])
}
