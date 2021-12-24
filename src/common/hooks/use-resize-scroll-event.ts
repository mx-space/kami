import { useStore } from 'common/store'
import { throttle } from 'lodash-es'
import { useCallback, useEffect, useRef } from 'react'

export const useResizeScrollEvent = () => {
  const _currentY = useRef(0)
  const { appStore: app } = useStore()
  const handleScroll = throttle(
    () => {
      const currentY = document.documentElement.scrollTop
      const direction = _currentY.current > currentY ? 'up' : 'down'
      app.updatePosition(direction)
      _currentY.current = currentY
    },
    50,
    { leading: true },
  )

  const registerEvent = useCallback(() => {
    const resizeHandler = throttle(() => {
      app.updateViewport()
    }, 300)
    window.onresize = resizeHandler
    app.updateViewport()

    if (typeof document !== 'undefined') {
      document.addEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    registerEvent()
    return () => {
      window.onresize = null
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])
}
