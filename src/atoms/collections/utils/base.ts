import { enableMapSet, immerable, produce } from 'immer'
import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

import type { Id } from './structure'
import { KeyValueCollection } from './structure'

enableMapSet()

interface BaseStore<T extends object> {
  data: KeyValueCollection<Id, T>
  add(id: string, data: T | T[]): void
  add(data: T | T[]): void
  addAndPatch(data: T | T[]): void
  remove(id: Id): void
}

// TODO ssr hydrate
export const createCollection = <T extends { id: Id }, A extends object>(
  name: string,
  actions?:
    | A
    | ((
        set: (
          partial:
            | Partial<BaseStore<T> & A>
            | ((state: BaseStore<T> & A) => Partial<BaseStore<T> & A>),
          replace?: boolean,
        ) => any,
        get: () => BaseStore<T> & A,
      ) => A),
) => {
  const data = new KeyValueCollection<Id, T>()

  data[immerable] = true
  return create(
    // @ts-ignore
    subscribeWithSelector<BaseStore<T> & A>((set, get) => ({
      data,
      ...(typeof actions === 'function' ? actions(set, get) : actions),
      add(...args: any[]) {
        const addFn = get().add

        const add = (id: string, data: T | T[]) => {
          if (Array.isArray(data)) {
            data.forEach((d) => {
              addFn(d)
            })

            return
          }

          set(
            produce((state) => {
              state.data.set(id, { ...data })
            }),
          )
        }

        if (typeof args[0] === 'string') {
          const id = args[0]
          const data = args[1]
          add(id, data)
        } else {
          const data = args[0]
          add(data.id, data)
        }
      },
      addAndPatch(data: T | T[]) {
        if (Array.isArray(data)) {
          const patch = get().addAndPatch
          data.forEach((d) => {
            patch(d)
          })
          return
        }
        set(
          produce((state) => {
            const collection = state.data
            if (collection.has(data.id)) {
              const exist = collection.get(data.id)

              collection.set(data.id, { ...exist, ...data })
            } else {
              collection.set(data.id, data)
            }
          }),
        )
      },
      remove(id: Id) {
        set(
          produce((state) => {
            state.data.delete(id)
          }),
        )
      },
    })),
  )
}
