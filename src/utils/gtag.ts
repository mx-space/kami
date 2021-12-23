/*
 * @Author: Innei
 * @Date: 2020-04-30 20:59:02
 * @LastEditTime: 2020-06-14 20:17:36
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/gtag.ts
 * @Coding with Love
 */

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID

declare const window: any
// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  if (!GA_TRACKING_ID) {
    return
  }
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  if (!GA_TRACKING_ID) {
    return
  }
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
