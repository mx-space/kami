import type { Atom, WritableAtom } from 'jotai'
import { atom } from 'jotai'

import { jotaiStore } from '~/atoms/store'

import type { Id } from './structure'
import { KeyValueCollection } from './structure'

type Identifiable = { id: Id }
export class BaseCollection<T extends Identifiable> extends KeyValueCollection<
  Id,
  T & { isDeleted?: boolean }
> {
  constructor() {
    super()
    this.register.call(this, 'data', atom(this.data))
    this.atomKeys = []
  }

  // store raw data key which register by atom
  private atomKeys: string[]

  protected register<T, K extends string>(
    key: K,
    atom: WritableAtom<T, any, any>,
  ) {
    // @ts-ignore
    if (typeof this[key] === 'undefined') {
      throw new ReferenceError()
    }
    // @ts-ignore
    this[`__${key}Atom`] = atom
    // @ts-ignore
    jotaiStore.set(atom, this[key])

    this.atomKeys.push(key)
  }

  protected getValue(key: string) {
    // @ts-ignore
    return jotaiStore.get(this[`__${key}Atom`] as Atom<any>)
  }

  protected setScope(fn: () => any | Promise<any>) {
    const result = fn()

    if ('then' in result && 'finally' in result) {
      result.finally((res) => {
        for (const key in this.atomKeys) {
          // immer
          const nextValue = this[key]
          jotaiStore.set(this[`__${key}Atom`], nextValue)
        }
        return res
      })
    }
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
