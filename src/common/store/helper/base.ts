import { action, makeObservable } from 'mobx'
import { Id, KeyValueCollection } from './structure'

type Identifiable = { id: Id }
export class Store<T extends Identifiable> extends KeyValueCollection<Id, T> {
  constructor() {
    super()

    makeObservable(this, {
      add: action,
      remove: action,
      addAndPatch: action,
    })
  }

  add(id: string, data: T | T[]): this
  add(data: T | T[]): this
  add(...args: any[]): this {
    const add = (id: string, data: T | T[]) => {
      if (Array.isArray(data)) {
        data.forEach((d) => {
          this.add(d)
        })
        return
      }
      this.set(id, { ...data })
    }

    if (typeof args[0] === 'string') {
      const id = args[0]
      const data = args[1]
      add(id, data)
    } else {
      const data = args[0]
      add(data.id, data)
    }

    return this
  }

  // same as add, but ignores `undefined`
  addAndPatch(data: T | T[]): this {
    if (Array.isArray(data)) {
      data.forEach((d) => {
        this.addAndPatch(d)
      })
      return this
    }
    if (this.has(data.id)) {
      const exist = this.get(data.id)
      this.set(data.id, { ...exist, ...data })
    } else {
      this.set(data.id, data)
    }
    return this
  }

  remove(id: Id): this {
    this.delete(id)
    return this
  }

  hydrate(data?: any) {
    if (data) {
      this.data = data
    }
  }
}