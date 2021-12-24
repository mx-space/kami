import { Router } from 'next/router'
import QProgress from 'qier-progress'
import { useEffect } from 'react'
const Progress = new QProgress({ colorful: false, color: '#27ae60' })
export const useRouterEvent = () => {
  useEffect(() => {
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

    Router.events.on('routeChangeComplete', (url) => window?.gtag.pageview(url))
  })
}
