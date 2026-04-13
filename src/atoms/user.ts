import { createWithEqualityFn } from 'zustand/traditional'

import type { UserModel } from '@mx-space/api-client'

import { useAppStore } from './app'

interface UserState {
  master: Partial<UserModel> | null
  isLogged: boolean
}

interface UserAction {
  setUser(model: UserModel): void
  setLoggedIn(isLogged: boolean): void
}

const userDefault: UserState = {
  master: null,
  isLogged: false,
}

export const useUserStore = createWithEqualityFn<UserState & UserAction>(
  (setState) => {
    return {
      ...userDefault,

      setLoggedIn(isLogged) {
        if (!isLogged) {
          setState({ isLogged: false })
          return
        }
        setState({ isLogged: true })

        requestAnimationFrame(() => {
          useAppStore.getState().fetchUrl()
        })
      },
      setUser(model) {
        setState({ master: model })
      },
    }
  },
)

export const useMasterName = () =>
  useUserStore((state) => state.master?.name || '')

export const useIsLogged = () => useUserStore((state) => state.isLogged)
