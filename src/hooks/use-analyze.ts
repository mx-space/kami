import type { MaidianAction } from 'constants/maidian'
import { useCallback } from 'react'

import { useThemeConfig } from './use-initial-data'

export const useAnalyze = () => {
  const config = useThemeConfig()

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

      window.umami?.trackView(url)
    },
    [GA_TRACKING_ID, isEnableGA],
  )

  // https://developers.google.com/analytics/devguides/collection/gtagjs/events
  const event = useCallback(
    ({
      action,
      category,
      label,
      value,
    }: {
      action: MaidianAction
      label?: string
      category?: string
      value?: number
    }) => {
      if (!GA_TRACKING_ID || !isEnableGA) {
        return
      }
      try {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value,
        })
        window.umami?.trackEvent(label || value?.toString() || '', action)
      } catch (err) {
        console.log(err)
      }
    },
    [GA_TRACKING_ID, isEnableGA],
  )

  return {
    event,
    pageview,
  }
}
