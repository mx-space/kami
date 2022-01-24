import { useEffect } from 'react'
import { useStore } from 'store'
import useDarkMode from 'use-dark-mode'

const noop = () => {}

const mockElement = {
  classList: {
    add: noop,
    remove: noop,
  },
}
const darkModeKey = 'darkMode'
export const useMediaToggle = () => {
  const { appStore: app } = useStore()
  const { disable, enable, toggle, value } = useDarkMode(false, {
    classNameDark: 'dark',
    classNameLight: 'light',
    storageKey: darkModeKey,
    element: (globalThis.document && document.documentElement) || mockElement,
  })

  useEffect(() => {
    app.colorMode = value ? 'dark' : 'light'
  }, [value])

  useEffect(() => {
    const handler = () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches && value) {
        localStorage.removeItem(darkModeKey)
      }
    }
    window.addEventListener('beforeunload', handler)

    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [value])

  return {
    disable,
    enable,
    toggle,
    value,
  }
}
