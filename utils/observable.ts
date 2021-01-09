/*
 * @Author: Innei
 * @Date: 2020-05-23 14:31:11
 * @LastEditTime: 2021-01-09 12:37:37
 * @LastEditors: Innei
 * @FilePath: /web/utils/observable.ts
 * @MIT
 */

import { EventTypes } from '../common/socket/types'

interface Observer {
  id: string
  callback: Function
}
export class Observable {
  observers: Observer[] = []

  on(event: EventTypes, handler: any): void
  on(event: string, handler: any): void
  on(event: string, handler: (...rest: any) => void) {
    const isExist = this.observers.some(({ id, callback }) => {
      if (id === event && handler === callback) {
        return true
      }
      return false
    })
    if (!isExist) {
      this.observers.push({
        id: event,
        callback: handler,
      })
    }
  }

  emit(event: string, payload?: any): void
  emit(event: EventTypes, payload?: any): void
  emit(event: EventTypes, payload?: any) {
    this.observers.map(({ id, callback }) => {
      if (id === event) {
        callback.call(this, payload)
      }
    })
  }

  off(event: string, handler?: (...rest: any) => void) {
    if (handler) {
      const index = this.observers.findIndex(({ id, callback }) => {
        return id === event && callback === handler
      })
      if (index !== -1) {
        this.observers.splice(index, 1)
      }
    } else {
      const observers = [] as Observer[]
      this.observers.map((observer) => {
        if (observer.id !== event) {
          observers.push(observer)
        }
      })

      this.observers = observers
    }
  }
}

export default new Observable()
