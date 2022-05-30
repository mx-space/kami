import debounce from 'lodash-es/debounce'
import throttle from 'lodash-es/throttle'
import { useEffect, useRef } from 'react'

import { useStore } from '~/store'

export const useResizeScrollEvent = () => {
  const _currentY = useRef(0)
  const { appStore: app } = useStore()

  useEffect(() => {
    const handleScroll = throttle(
      () => {
        const currentY = document.documentElement.scrollTop
        const direction = _currentY.current > currentY ? 'up' : 'down'
        app.updatePosition(direction)
        _currentY.current = currentY
      },
      50,
      { leading: false },
    )

    const resizeHandler = debounce(
      () => {
        app.updateViewport()
      },
      500,
      { leading: true },
    )
    window.onresize = resizeHandler
    app.updateViewport()

    if (typeof document !== 'undefined') {
      document.addEventListener('scroll', handleScroll)
    }
    return () => {
      window.onresize = null
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])
}
