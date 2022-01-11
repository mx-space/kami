/*
 * @Author: Innei
 * @Date: 2020-05-23 13:18:30
 * @LastEditTime: 2021-07-17 22:11:05
 * @LastEditors: Innei
 * @FilePath: /web/common/socket/socket-client.ts
 * @MIT
 */

import camelcaseKeys from 'camelcase-keys'
import io, { Socket } from 'socket.io-client'
import { isDev } from 'utils'
import { eventBus } from '../utils/event-emitter'
import { eventHandler } from './handler'
import { EventTypes } from './types'
export class SocketClient {
  public socket!: Socket

  constructor() {
    this.socket = io((process.env.NEXT_PUBLIC_GATEWAY_URL || '') + '/web', {
      timeout: 10000,
      reconnectionDelay: 3000,
      autoConnect: false,
      reconnectionAttempts: 3,
      transports: ['websocket'],
    })
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
        if (typeof payload !== 'string') {
          return this.handleEvent(
            payload.type,
            camelcaseKeys(payload.data, { deep: true }),
          )
        }
        const { data, type } = JSON.parse(payload) as {
          data: any
          type: EventTypes
        }
        this.handleEvent(type, camelcaseKeys(data, { deep: true }))
      },
    )
  }
  reconnect() {
    this.socket.open()
  }
  handleEvent(type: EventTypes, data: any) {
    if (isDev) {
      console.log(data)
    }
    eventBus.emit(type, data)
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
