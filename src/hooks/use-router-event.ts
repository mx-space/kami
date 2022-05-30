import { Router } from 'next/router'
import { useEffect } from 'react'

import { isClientSide, isServerSide } from '~/utils/env'

import QProgress from '../../third/qp'
import { useAnalyze } from './use-analyze'

export const useRouterEvent = () => {
  const { pageview } = useAnalyze()
  useEffect(() => {
    if (isServerSide()) {
      return
    }
    const Progress = new QProgress({ colorful: false, color: '#27ae60' })
    if (isClientSide()) {
      ;(window as any).process = Progress
    }
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
  }, [])
}
