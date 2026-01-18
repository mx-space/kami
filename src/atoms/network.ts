import { create } from 'zustand'

type NetworkState = {
  activeRequestCount: number
}

type NetworkAction = {
  beginRequest(): void
  endRequest(): void
  reset(): void
}

export const useNetworkStore = create<NetworkState & NetworkAction>((set) => ({
  activeRequestCount: 0,
  beginRequest() {
    set((state) => ({ activeRequestCount: state.activeRequestCount + 1 }))
  },
  endRequest() {
    set((state) => ({
      activeRequestCount: Math.max(0, state.activeRequestCount - 1),
    }))
  },
  reset() {
    set({ activeRequestCount: 0 })
  },
}))

