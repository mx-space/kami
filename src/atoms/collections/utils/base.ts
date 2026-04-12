import { enableMapSet, immerable } from 'immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type Id = string

enableMapSet()

interface BaseStore<T extends object, TT = ModelWithDeleted<T>> {
  data: Map<Id, TT>
  add(id: string, data: T | T[]): void
  add(data: T | T[]): void
  addOrPatch(data: T | T[]): void
  remove(id: Id): void
  softDelete(key: string): boolean
}

export type ModelWithDeleted<T> = { isDeleted?: boolean } & T

type Setter<
  T extends object,
  A extends object,
> = (
  partial:
    | Partial<BaseStore<T> & A>
    | ((state: BaseStore<T> & A) => Partial<BaseStore<T> & A> | void),
  replace?: boolean,
) => any

// TODO ssr hydrate
export const createCollection = <T extends object, A extends object>(
  name: string,
  actions?: A | ((set: Setter<T, A>, get: () => BaseStore<T> & A) => A),
) => {
  const data = new Map<Id, T>()
  data[immerable] = true

  return createWithEqualityFn(
    immer(
      // @ts-ignore
      subscribeWithSelector<BaseStore<T> & A>((set: Setter<T, A>, get) => ({
        data,

        ...(typeof actions === 'function' ? actions(set, get) : actions),

        softDelete(key) {
          const data = get().data.get(key)
          if (!data) {
            return false
          }

          set((state) => {
            const data = state.data.get(key)
            if (data) data.isDeleted = true
          })

          return true
        },
        add(...args: any[]) {
          const addFn = get().add

          const add = (id: string, data: T | T[]) => {
            if (Array.isArray(data)) {
              data.forEach((d) => {
                addFn(d)
              })

              return
            }

            set((state) => {
              state.data.set(id, { ...data })
            })
          }

          if (typeof args[0] === 'string') {
            const id = args[0]
            const data = args[1]
            add(id, data)
          } else {
            const data = args[0]
            add((data as any).id, data)
          }
        },
        addOrPatch(data: T | T[]) {
          if (Array.isArray(data)) {
            const patch = get().addOrPatch
            data.forEach((d) => {
              patch(d)
            })
            return
          }
          set((state) => {
            const collection = state.data
            const itemId = (data as any).id
            if (collection.has(itemId)) {
              const exist = collection.get(itemId)

              collection.set(itemId, { ...exist, ...data })
            } else {
              collection.set(itemId, data)
            }
          })
        },
        remove(id: Id) {
          set((state) => {
            state.data.delete(id)
          })
        },
      })),
    ),
  )
}
