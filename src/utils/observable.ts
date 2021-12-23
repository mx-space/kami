/*
 * @Author: Innei
 * @Date: 2020-05-23 14:31:11
 * @LastEditTime: 2021-01-09 12:37:37
 * @LastEditors: Innei
 * @FilePath: /web/utils/observable.ts
 * @MIT
 */

import { EventTypes } from '../common/socket/types'

export class Observable {
  private observers: Record<string, Function[]> = {}

  on(event: EventTypes, handler: any): void
  on(event: string, handler: any): void
  on(event: string, handler: (...rest: any) => void) {
    const queue = this.observers[event]
    if (!queue) {
      this.observers[event] = [handler]
      return
    }
    const isExist = queue.some((func) => {
      return func === handler
    })
    if (!isExist) {
      this.observers[event].push(handler)
    }
  }

  emit(event: string, payload?: any): void
  emit(event: EventTypes, payload?: any): void
  emit(event: EventTypes, payload?: any) {
    const queue = this.observers[event]
    if (!queue) {
      return
    }
    for (const func of queue) {
      func.call(this, payload)
    }
  }

  off(event: string, handler?: (...rest: any) => void) {
    const queue = this.observers[event]
    if (!queue) {
      return
    }

    if (handler) {
      const index = queue.findIndex((func) => {
        return func === handler
      })
      if (index !== -1) {
        queue.splice(index, 1)
      }
    } else {
      queue.length = 0
    }
  }
}
export const EventBus = new Observable()
export default EventBus
