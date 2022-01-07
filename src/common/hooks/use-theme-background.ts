import { useStore } from 'common/store'
import { useEffect } from 'react'
import { useKamiConfig } from './use-initial-data'

export const useThemeBackground = () => {
  const {
    appStore: { colorMode },
  } = useStore()
  const {
    site: { background },
  } = useKamiConfig()
  useEffect(() => {
    const $style = document.createElement('style')
    $style.innerHTML = `body { background: url(${background.src[colorMode]}) ${background.position}; background-color: var(--light-bg);  }`

    document.head.appendChild($style)
    return () => {
      document.documentElement.removeChild($style)
    }
  }, [background.position, background.src, colorMode])
}
