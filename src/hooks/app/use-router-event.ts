import { Router } from 'next/router'
import { useEffect } from 'react'

import QProgress from '../../../third/qp'
import { useAnalyze } from './use-analyze'

export const useRouterEvent = () => {
  const { pageview } = useAnalyze()
  useEffect(() => {
    const Progress = new QProgress({
      colorful: false,
      color: 'var(--primary)',
    })

    const startDelayMs = 150
    const minVisibleMs = 250

    let startTimer: ReturnType<typeof setTimeout> | null = null
    let startedAt = 0
    let started = false

    const clearStartTimer = () => {
      if (startTimer) {
        clearTimeout(startTimer)
        startTimer = null
      }
    }

    const scheduleStart = () => {
      clearStartTimer()
      startTimer = setTimeout(() => {
        started = true
        startedAt = Date.now()
        Progress.start()
      }, startDelayMs)
    }

    const finishIfStarted = () => {
      clearStartTimer()
      if (!started) return
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, minVisibleMs - elapsed)
      setTimeout(() => {
        Progress.finish()
      }, remaining)
      started = false
    }

    const onStart = () => {
      scheduleStart()
      const current = history.state?.as
      history.backPath = history.backPath ? [...history.backPath, current] : [current]
    }

    const onComplete = (url: string) => {
      finishIfStarted()
      pageview(url)
    }

    const onError = () => {
      history.backPath?.pop()
      finishIfStarted()
    }

    Router.events.on('routeChangeStart', onStart)
    Router.events.on('routeChangeComplete', onComplete)
    Router.events.on('routeChangeError', onError)

    return () => {
      clearStartTimer()
      Router.events.off('routeChangeStart', onStart)
      Router.events.off('routeChangeComplete', onComplete)
      Router.events.off('routeChangeError', onError)
    }
  }, [pageview])
}
