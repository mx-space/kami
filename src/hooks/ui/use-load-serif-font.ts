import { useInsertionEffect } from 'react'

import { loadStyleSheet } from '~/utils/load-script'

export const useLoadSerifFont = () => {
  useInsertionEffect(() => {
    loadStyleSheet(
      'https://fonts.googleapis.com/css?family=Noto+Serif+SC&display=swap',
    )
  }, [])
}
