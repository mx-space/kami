import { useEffect } from 'react'

import { loadStyleSheet } from '~/utils/load-script'

export const useLoadSerifFont = () => {
  useEffect(() => {
    loadStyleSheet(
      'https://fonts.loli.net/css?family=Noto+Serif+SC&display=swap',
    )
  }, [])
}
