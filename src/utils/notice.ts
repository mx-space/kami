import React from 'react'
import { toast } from 'react-toastify'

import { useAppStore } from '~/atoms/app'
import { useUserStore } from '~/atoms/user'
import { ToastCard } from '~/components/widgets/Toast/card'
import { TrackerAction } from '~/constants/tracker'
import { emitTrackerEvent } from '~/hooks/app/use-analyze'

import { isDev, isServerSide } from './env'

export class Notice {
  static shared = new Notice()
  isInit = false
  private $wrap?: HTMLDivElement

  initNotice(): Promise<boolean> {
    if (isServerSide()) {
      return new Promise((r) => r(false))
    }

    return new Promise((r) => {
      if (isServerSide()) {
        return
      }
      if (!('Notification' in window)) {
        r(false)
      } else if (Notification.permission !== 'denied') {
        try {
          Notification.requestPermission().then((p) => {
            emitTrackerEvent({
              action: TrackerAction.Interaction,
              label: p == 'granted' ? '通知开启' : '拒绝开启通知',
            })

            return p == 'granted' ? r(true) : r(false)
          })
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

  /**
   * 通知，若页面活跃则显示页面内通知，否则系统通知
   */
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
        onClick: onclick,
      })
    }

    return new Promise((r) => {
      this.initNotice().then((b) => {
        if (b && !document.hasFocus()) {
          emitTrackerEvent({
            action: TrackerAction.Interaction,
            label: '外部通知触发',
          })
          const notification = new Notification(title, {
            body: text,
            image:
              useUserStore.getState().master?.avatar ||
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
    onClick = null,
    avatar,
    description,
  }: {
    text?: string
    title?: string
    duration?: number
    description?: string
    string?: string
    avatar?: string
    onClick?: ((ev: MouseEvent) => void) | null
  }) {
    if (isServerSide()) {
      return
    }

    emitTrackerEvent({
      action: TrackerAction.Interaction,
      label: '内嵌通知触发',
    })

    const viewport = useAppStore.getState().viewport
    const isPadOrMobile = viewport.pad || viewport.mobile
    const id = toast(
      React.createElement(ToastCard, {
        text,
        title,
        description,
        avatar,
        getToastId: () => id,
        onClick(e) {
          onClick?.(e)
          toast.dismiss(id)
        },
      }),
      {
        autoClose: duration,
        closeOnClick: false,
        position: isPadOrMobile ? 'top-center' : 'top-right',
      },
    )
  }
}

if (!isServerSide()) {
  window.n = Notice.shared
}
