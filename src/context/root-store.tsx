import { configure } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import type { ReactNode } from 'react'
import React, { createContext, useContext } from 'react'

import { isClientSide, isDev, isServerSide } from '~/utils/env'

import { RootStore } from '../store/root-store'

enableStaticRendering(isServerSide())

configure({
  useProxies: 'always',
})

let $store: RootStore
const StoreContext = createContext<RootStore | undefined>(undefined)
StoreContext.displayName = 'StoreContext'

export function useRootStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useRootStore must be used within RootStoreProvider')
  }

  return context
}
export const store = initializeStore()
export function RootStoreProvider({ children }: { children: ReactNode }) {
  if (isDev && isClientSide() && !window.store) {
    Object.defineProperty(window, 'store', {
      get() {
        return store
      },
    })
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

function initializeStore(): RootStore {
  const _store = $store ?? new RootStore()

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!$store) $store = _store

  return _store
}
