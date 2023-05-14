import { useCallback, useEffect } from 'react'

import { useUserStore } from '~/atoms/user'
import type { TrackerAction } from '~/constants/tracker'
import { CustomEventTypes } from '~/types/events'
import { isDev } from '~/utils/env'
import { eventBus } from '~/utils/event-emitter'

import { useThemeConfig } from './use-initial-data'

declare global {
  interface Window {
    // 百度统计
    _hmt?: {
      /**
       * https://tongji.baidu.com/holmes/Tongji/%E7%BB%9F%E8%AE%A1%E5%BC%80%E6%94%BE%E6%89%8B%E5%86%8C/JS-API%E6%8A%80%E6%9C%AF%E6%96%87%E6%A1%A3/_trackEvent
       * @param options
       */
      push(options: any): void
    }
  }
}

type TrackerOptions = {
  action: TrackerAction
  label?: string
  category?: string
  value?: number
}
export const useRootTrackerListener = () => {
  const { event } = useAnalyze()
  useEffect(() => {
    eventBus.on(CustomEventTypes.Tracker, (options: TrackerOptions) => {
      event(options)
    })

    return () => {
      eventBus.off(CustomEventTypes.Tracker)
    }
  }, [])
}

export const emitTrackerEvent = (options: TrackerOptions) => {
  eventBus.emit(CustomEventTypes.Tracker, options)
}

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
      window._hmt?.push(['_trackPageview', url])
    },
    [GA_TRACKING_ID, isEnableGA],
  )

  // https://developers.google.com/analytics/devguides/collection/gtagjs/events
  const event = useCallback(
    (options: TrackerOptions) => {
      const { action, label, category = label, value } = options
      if (isDev || useUserStore.getState().isLogged) {
        console.log('event', options)
        return
      }
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

        window._hmt?.push(['_trackEvent', category || 'event', action, label])
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
