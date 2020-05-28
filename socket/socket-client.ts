/*
 * @Author: Innei
 * @Date: 2020-05-23 13:18:30
 * @LastEditTime: 2020-05-28 18:55:24
 * @LastEditors: Innei
 * @FilePath: /mx-web/socket/socket-client.ts
 * @MIT
 */

import io from 'socket.io-client'

import { Notice } from '../utils/notice'
import { EventTypes } from './types'
import configs from '../configs'
import { gatewayStore, userStore } from '../store'
import { openNotification } from '../components/Notification'
import observable from '../utils/observable'

export class SocketClient {
  public socket!: SocketIOClient.Socket

  #title = configs.title
  #notice = new Notice()
  constructor() {
    this.socket = io(
      (process.env.GATEWAY_URL || 'http://localhost:2333') + '/web',
      {
        timeout: 10000,
        reconnectionDelay: 3000,
        autoConnect: false,
        forceNew: true,
      },
    )
  }
  initIO() {
    if (!this.socket) {
      return
    }
    this.socket.open()
    this.socket.on(
      'message',
      (payload: string | Record<'type' | 'data', any>) => {
        if (typeof payload !== 'string') {
          return this.handleEvent(payload.type, payload.data)
        }
        const { data, type } = JSON.parse(payload) as {
          data: any
          type: EventTypes
        }
        this.handleEvent(type, data)
      },
    )
  }
  reconnect() {
    this.socket.open()
  }
  handleEvent(type: EventTypes, data: any) {
    observable.emit(type, data)
    switch (type) {
      case EventTypes.VISITOR_ONLINE:
      case EventTypes.VISITOR_OFFLINE: {
        const { online } = data
        gatewayStore.online = online
        break
      }
      case EventTypes.POST_CREATE:
      case EventTypes.NOTE_CREATE: {
        const message = noticeHead('文章', data.title)
        this.#notice.notice(this.#title, message)
        openNotification({
          key: data._id,
          message,
          description: getDescription(data.text),
        })
        break
      }
      case EventTypes.SAY_CREATE: {
        const message = noticeHead('说说')
        this.#notice.notice(this.#title, message)
        openNotification({
          key: data._id,
          message,
          description: getDescription(data.text),
        })
        break
      }
    }
  }
  emit(event: EventTypes, payload: any) {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) {
        this.socket.emit(event, payload, (payload) => {
          resolve(payload)
        })
      }
    })
  }
}

function noticeHead(type: string, title?: string) {
  return `${userStore.name}发布了新的${type}${title ? ': ' + title : ''}`
}
function getDescription(text: string) {
  return text.slice(0, 20) + '...'
}
