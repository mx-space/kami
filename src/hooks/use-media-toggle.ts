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

export const useMediaToggle = () => {
  const { appStore: app } = useStore()
  const { disable, enable, toggle, value } = useDarkMode(false, {
    classNameDark: 'dark',
    classNameLight: 'light',
    element: (globalThis.document && document.documentElement) || mockElement,
  })

  useEffect(() => {
    app.colorMode = value ? 'dark' : 'light'
  }, [value])

  return {
    disable,
    enable,
    toggle,
    value,
  }
}
