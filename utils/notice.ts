/*
 * @Author: Innei
 * @Date: 2020-05-23 13:20:20
 * @LastEditTime: 2020-05-23 14:14:03
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/notice.ts
 * @MIT
 */

export class Notice {
  constructor() {
    this.initNotice()
  }

  initNotice(): Promise<boolean> {
    return new Promise((r, j) => {
      if (typeof window == 'undefined') {
        return
      }
      if (!('Notification' in window)) {
        j('浏览器不支持发送通知')
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((p) =>
          p === 'granted' ? r(true) : j('已拒绝通知'),
        )
      } else if (Notification.permission === 'denied') {
        return j('已拒绝通知')
      } else {
        j(true)
      }
    })
  }

  notice(
    title: string,
    body: string,
    options: Omit<NotificationOptions, 'body'> = {},
  ): Promise<Notification | undefined> {
    return new Promise((r) => {
      this.initNotice().then((b) => {
        if (b) {
          const notification = new Notification(title, { body, ...options })
          r(notification)
        }
      })
    })
  }
}
