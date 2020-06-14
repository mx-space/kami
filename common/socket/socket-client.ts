/*
 * @Author: Innei
 * @Date: 2020-05-23 13:18:30
 * @LastEditTime: 2020-05-29 20:28:25
 * @LastEditors: Innei
 * @FilePath: /mx-web/socket/socket-client.ts
 * @MIT
 */

import io from 'socket.io-client'
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
    eventHandler(type, data)
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
