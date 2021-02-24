/*
 * @Author: Innei
 * @Date: 2020-05-23 13:20:20
 * @LastEditTime: 2021-02-24 20:29:37
 * @LastEditors: Innei
 * @FilePath: /web/utils/notice.ts
 * @MIT
 */

export class Notice {
  isInit = false
  private $wrap?: HTMLDivElement
  initNotice(): Promise<boolean> {
    if (typeof document === 'undefined') {
      return new Promise((r) => r(false))
    }
    // create page notification wrap
    let $wrap = this.$wrap
    const $$wrap = document.getElementById(
      'notification-wrap',
    ) as HTMLDivElement
    if (!this.$wrap && $$wrap) {
      $wrap = this.$wrap = $$wrap
    }
    if (!$wrap) {
      const $wrap = document.createElement('div')
      $wrap.id = 'notification-wrap'
      $wrap.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 350px;
        padding: 12px;
        z-index: 999;
      `
      document.documentElement.appendChild($wrap)
      this.$wrap = $wrap
    }

    return new Promise((r) => {
      if (typeof window == 'undefined') {
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
    body,
    description,
    onclick = null,
    options = {},
  }: {
    title: string
    body: string
    onclick?: ((ev: Event) => any) | null
    description?: string
    options?: Omit<NotificationOptions, 'body'>
  }): Promise<Notification | undefined> {
    if (!this.isInit) {
      this.isInit = await this.initNotice()
    }

    if (document.hasFocus()) {
      this.createFrameNotification({
        title,
        text: body,
        description,
        onclick,
      })
    }

    return new Promise((r) => {
      this.initNotice().then((b) => {
        if (b && !document.hasFocus()) {
          const notification = new Notification(title, {
            body,
            image: location.origin + '/logo.png',
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

  createFrameNotification({
    text,
    title,
    duration = 5000,
    onclick = null,
    description,
  }: {
    text: string
    title: string
    duration?: number
    description?: string
    onclick?: ((ev: MouseEvent) => void) | null
  }) {
    if (typeof document !== 'undefined' && this.$wrap) {
      const $notification = document.createElement('div')
      const $title = document.createElement('div')
      const $text = document.createElement('div')
      const $header = document.createElement('div')
      const $desc = description ? document.createElement('p') : null

      const $close = document.createElement('div')
      const $wrap = this.$wrap
      $notification.style.cssText = `
        width: 100%;
        overflow: hidden;
        background: var(--bg-opacity);
        border-radius: 12px;
        backdrop-filter: saturate(150%) blur(30px);
        user-select: none;
        margin-bottom: 12px;
      `
      $header.style.cssText = `
        color: var(--gray);
        background: var(--bg-opacity);
        display: grid;
        position: relative;
        grid-template-columns: auto 1em;
        padding-right: 2em;
        backdrop-filter: brightness(0.8)
      `
      $close.style.cssText = `
        line-height: 2;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--black);
        cursor: pointer;
      `
      $close.textContent = '×'
      $close.onclick = () => this.closeNotification($notification)
      $header.appendChild($title)
      $header.appendChild($close)
      $notification.classList.add('shadow')
      $title.style.cssText = `
        font-size: 14px;
        font-weight: bold;
        line-height: 2.4;
        color: var(--black);
        margin-left: 18px
      `
      $title.textContent = title
      $text.textContent = text
      $text.style.cssText = `
      margin: 12px 0 18px;
      padding: 0 18px;
      color: var(--gray);
      font-size: 14px;
      `
      $notification.appendChild($header)
      if ($desc && description) {
        $desc.textContent = description
        $text.appendChild($desc)
      }
      $notification.appendChild($text)
      $notification.onclick = (e) => {
        onclick?.call(this, e)
        this.closeNotification($notification)
      }
      $wrap.appendChild($notification).animate(
        [
          {
            transform: 'translateX(100%)',
          },
          {
            transform: 'translateX(0)',
          },
        ],
        { duration: 500 },
      ).onfinish = () => {
        setTimeout(() => {
          this.closeNotification($notification)
        }, duration)
      }
      return $notification
    }
  }

  closeNotification($notification: HTMLDivElement) {
    $notification.animate(
      [
        {
          transform: 'translateX(0)',
          opacity: '1',
        },
        {
          transform: 'translateX(100%)',
          opacity: '0',
        },
      ],
      {
        duration: 230,
        composite: 'replace',
        easing: 'cubic-bezier(0.5, 0, 0.75, 0)',
      },
    ).onfinish = () => {
      $notification.remove()
    }
  }
}
