import React from 'react'
import ReactDOM from 'react-dom'
import { ToastContainer, toast } from 'react-toastify'

import { ToastCard } from '~/components/widgets/Toast/card'
import { store } from '~/store'

import { isDev, isServerSide } from './env'

export class Notice {
  static shared = new Notice()
  isInit = false
  private $wrap?: HTMLDivElement
  initNotice(): Promise<boolean> {
    if (isServerSide()) {
      return new Promise((r) => r(false))
    }

    if (!this.$wrap) {
      this.$wrap = document.createElement('div')
      document.documentElement.appendChild(this.$wrap)
      ReactDOM.render(
        React.createElement(ToastContainer, {
          autoClose: 3000,
          pauseOnHover: true,
          hideProgressBar: true,
          newestOnTop: true,
          closeOnClick: true,
          closeButton: false,
          toastClassName: ({ type }: any) => '',
          bodyClassName: () => '',
          style: {
            width: 350,
          },
        }),
        this.$wrap!,
      )
    }

    return new Promise((r) => {
      if (isServerSide()) {
        return
      }
      if (!('Notification' in window)) {
        r(false)
      } else if (Notification.permission !== 'denied') {
        try {
          Notification.requestPermission().then((p) =>
            p === 'granted' ? r(true) : r(false),
          )
        } catch (error) {
          // Safari doesn't return a promise for requestPermissions and it
          // throws a TypeError. It takes a callback as the first argument
          // instead.
          if (error instanceof TypeError) {
            Notification.requestPermission((p) =>
              p === 'granted' ? r(true) : r(false),
            )
          } else {
            throw error
          }
        }
      } else if (Notification.permission === 'denied') {
        return r(false)
      } else {
        r(true)
      }
    })
  }

  async notice({
    title,
    text,
    description,
    onclick = null,
    options = {},
  }: {
    title: string
    text: string
    onclick?: ((ev: Event) => any) | null
    description?: string
    options?: Omit<NotificationOptions, 'body'>
  }): Promise<Notification | undefined> {
    if (!this.isInit) {
      this.isInit = await this.initNotice()
    }

    if (document.hasFocus() || isDev) {
      this.createFrameNotification({
        title: text,
        text: description,
        duration: 5000,
        onclick,
      })
    }

    return new Promise((r) => {
      this.initNotice().then((b) => {
        if (b && !document.hasFocus()) {
          const notification = new Notification(title, {
            body: text,
            image:
              store.userStore.master?.avatar ||
              `${location.origin}/manifest-icon-192.png`,

            ...options,
          })
          notification.onclick = (e) => {
            onclick?.(e)
            notification.close()
          }
          r(notification)
        }
      })
    })
  }
  /** 页面内通知 */
  createFrameNotification({
    text,
    title,
    duration = 5000,
    onclick = null,
    description,
  }: {
    text?: string
    title: string
    duration?: number
    description?: string
    onclick?: ((ev: MouseEvent) => void) | null
  }) {
    if (isServerSide()) {
      return
    }

    toast(React.createElement(ToastCard, { text, title, description }), {
      autoClose: duration,

      onClick(e) {
        onclick?.(e.nativeEvent)
      },
    })
  }
}

if (!isServerSide()) {
  window.n = Notice.shared
}
