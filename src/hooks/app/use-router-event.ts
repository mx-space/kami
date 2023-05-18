import { Router } from 'next/router'
import { startTransition, useEffect } from 'react'

import QProgress from '../../../third/qp'
import { useAnalyze } from './use-analyze'

export const useRouterEvent = () => {
  const { pageview } = useAnalyze()
  useEffect(() => {
    startTransition(() => {
      const Progress = new QProgress({
        colorful: false,
        color: 'var(--primary)',
      })

      Router.events.on('routeChangeStart', () => {
        Progress.start()
        history.backPath = history.backPath
          ? [...history.backPath, history.state.as]
          : [history.state.as]
      })

      Router.events.on('routeChangeComplete', () => {
        Progress.finish()
      })

      Router.events.on('routeChangeError', () => {
        history.backPath?.pop()
        Progress.finish()
      })

      Router.events.on('routeChangeComplete', (url) => pageview(url))
    })
  }, [])
}
