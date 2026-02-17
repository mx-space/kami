import type { CustomEventTypes } from '~/types/events'

import type { EventTypes } from '../types/events'

export class EventEmitter {
  private observers: Record<string, ((...args: any[]) => void)[]> = {}

  on(event: EventTypes, handler: any): void
  on(event: CustomEventTypes, handler: any): void
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

  emit(event: CustomEventTypes, payload?: any): void
  emit(event: EventTypes, payload?: any): void
  emit(event: string, payload?: any) {
    const queue = this.observers[event]
    if (!queue) {
      return
    }
    for (const func of queue) {
      func.call(this, payload)
    }
  }

  off(event: CustomEventTypes, handler?: (...rest: any) => void)
  off(event: EventTypes, handler?: (...rest: any) => void)
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
export const eventBus = new EventEmitter()
