import { isClientSide } from './env'

export function localStorageProvider() {
  if (!isClientSide()) {
    return new Map()
  }
  const key = 'kami-app-cache'
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem(key) || '[]'))

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem(key, appCache)
  })

  // We still use the map for write & read for performance.
  return map
}
