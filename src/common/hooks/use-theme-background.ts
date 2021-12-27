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
    const $body = document.body
    $body.style.background = `url(${background.src[colorMode]}) ${background.position}`
  }, [background.position, background.src, colorMode])
}
