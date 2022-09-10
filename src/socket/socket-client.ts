import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import { GATEWAY_URL } from '~/constants/env'
import type { EventTypes } from '~/types/events'
import { isDev } from '~/utils/env'

import { eventBus } from '../utils/event-emitter'
import { eventHandler } from './handler'

export class SocketClient {
  public socket!: Socket

  constructor() {
    this.socket = io(`${GATEWAY_URL}/web`, {
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
          return this.handleEvent(payload.type, camelcaseKeys(payload.data))
        }
        const { data, type } = JSON.parse(payload) as {
          data: any
          type: EventTypes
        }
        this.handleEvent(type, camelcaseKeys(data))
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
