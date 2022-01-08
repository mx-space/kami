import { useCallback } from 'react'
import { useThemeConfig } from './use-initial-data'

export const useGtag = () => {
  const config = useThemeConfig()
  // const c = useInitialData()
  // console.log(config)

  const GA_TRACKING_ID = config.function.analyze.ga

  const isEnableGA = config.function.analyze.enable

  const pageview = useCallback(
    (url: string) => {
      if (!GA_TRACKING_ID || !isEnableGA) {
        return
      }
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      })
    },
    [GA_TRACKING_ID, isEnableGA],
  )

  // https://developers.google.com/analytics/devguides/collection/gtagjs/events
  const event = useCallback(
    ({ action, category, label, value }) => {
      if (!GA_TRACKING_ID || !isEnableGA) {
        return
      }
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    },
    [GA_TRACKING_ID, isEnableGA],
  )

  return {
    event,
    pageview,
  }
}
