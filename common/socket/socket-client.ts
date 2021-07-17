/*
 * @Author: Innei
 * @Date: 2020-05-23 13:18:30
 * @LastEditTime: 2021-07-17 22:11:05
 * @LastEditors: Innei
 * @FilePath: /web/common/socket/socket-client.ts
 * @MIT
 */

import io from 'socket.io-client'
import { isDev } from 'utils'
import observable from '../../utils/observable'
import { eventHandler } from './handler'
import { EventTypes } from './types'
export class SocketClient {
  public socket!: SocketIOClient.Socket

  constructor() {
    this.socket = io(
      (process.env.GATEWAY_URL || 'http://localhost:2333') + '/web',
      {
        timeout: 10000,
        reconnectionDelay: 3000,
        autoConnect: false,
        reconnectionAttempts: 3,
        transports: ['websocket'],
      },
    )
  }
  initIO() {
    if (!this.socket) {
      return
    }
    this.socket.close()
    this.socket.open()
    this.socket.on(
      'message',
      (payload: string | Record<'type' | 'data', any>) => {
        if (isDev) {
          console.log(payload)
        }

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
    eventHandler(type, data)
  }
  emit(event: EventTypes, payload: any) {
    return new Promise((resolve) => {
      if (this.socket && this.socket.connected) {
        this.socket.emit(event, payload, (payload) => {
          resolve(payload)
        })
      }
    })
  }
}
