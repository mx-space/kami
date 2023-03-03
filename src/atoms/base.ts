import type { Atom } from 'jotai'
import { atom } from 'jotai'

import { jotaiStore } from './store'

export abstract class BaseStore<E> {
  default: E
  constructor(defaultValue: E) {
    this.default = defaultValue

    for (const key in this.default) {
      this.setAtomInternal(key, this.default[key])
    }
  }

  private setAtomInternal(key: any, value: any) {
    this[`__${key}Atom`] = atom(value)
  }

  protected setAtomValue<K extends keyof E>(
    key: K,
    value: E[K] | ((oldValue: E[K]) => E[K]),
  ) {
    let nextValue = value
    if (typeof value === 'function') {
      // @ts-ignore
      const oldValue = jotaiStore.get(this[`__${key}Atom`] as Atom<E[K]>)
      // @ts-ignore
      nextValue = value(oldValue)
    }
    // @ts-ignore
    jotaiStore.set(this[`__${key}Atom`] as Atom<E[K]>, nextValue)
  }

  protected getAtom<K extends keyof E>(key: K): Atom<E[K]> {
    // @ts-ignore
    return this[`__${key}Atom`]
  }

  protected computedMap = new Map<string, Atom<any>>()
  protected defineComputed<T>(key: string, fn: any): Atom<T> {
    const combinedKey = `${this.constructor.name}-${key}`
    if (this.computedMap.has(combinedKey)) {
      return this.computedMap.get(combinedKey) as Atom<T>
    }
    const result = fn()
    this.computedMap.set(combinedKey, result)
    return result as Atom<T>
  }
}
