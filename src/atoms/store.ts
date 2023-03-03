import type { Atom } from 'jotai'
import { createStore } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'

import { AppStore } from './app'

export const jotaiStore = createStore()

const jotaiStores = {
  app: new AppStore(),
}
export type JotaiStoreKey = keyof typeof jotaiStores
export const useJotaiStore = <
  T extends JotaiStoreKey,
  E extends keyof (typeof jotaiStores)[T]['default'],
>(
  storeKey: T,
) => {
  const classStore = jotaiStores[storeKey]
  const keys = Object.keys(classStore.default) as E[]

  const subs = useRef([] as (() => void)[])
  const deps = useRef(new Set<string>())
  const [_, forceUpdate] = useState({})

  useEffect(() => {
    const current = subs.current
    return () => {
      current.forEach((unsub) => unsub())
    }
  }, [])

  const proxy = useRef(
    new Proxy(Object.assign({}, classStore), {
      get(target, p: string, receiver) {
        if (keys.includes(p as E)) {
          const atom: Atom<any> = classStore[`__${p}Atom`]
          const atomkey = atom.toString()
          if (deps.current.has(atomkey)) {
            return jotaiStore.get(atom)
          }

          subs.current.push(
            jotaiStore.sub(atom, () =>
              unstable_batchedUpdates(() => forceUpdate({})),
            ),
          )
          deps.current.add(atomkey)

          return jotaiStore.get(atom)
        }

        if (p.startsWith('set')) {
          const replaceKey = p.replace('set', '')
          const atomKey = replaceKey[0].toLowerCase() + replaceKey.slice(1)

          return (
            val:
              | (typeof jotaiStores)[T]['default'][E]
              | ((
                  oldValue: (typeof jotaiStores)[T]['default'][E],
                ) => (typeof jotaiStores)[T]['default'][E]),
          ) => {
            let nextVal = val
            if (typeof val === 'function') {
              // @ts-ignore
              nextVal = val(jotaiStore.get(classStore[`__${atomKey}Atom`]))
            }
            jotaiStore.set(classStore[`__${atomKey}Atom`], nextVal)
          }
        }

        return Reflect.get(target, p, receiver)
      },
      set(target, p: string, value, receiver) {
        if (keys.includes(p as E)) {
          jotaiStore.set(classStore[`__${p}Atom`], value)
          return true
        }
        return Reflect.set(target, p, value, receiver)
      },
    }),
  ).current

  return proxy as {
    [K in E]: (typeof jotaiStores)[T]['default'][K]
  } & {
    // @ts-ignore
    [K in `set${Capitalize<E>}`]: (
      val: (typeof jotaiStores)[T]['default'][E],
    ) => void
  } & typeof classStore
}
