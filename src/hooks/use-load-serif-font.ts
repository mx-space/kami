import { useEffect } from 'react'
import { loadStyleSheet } from 'utils'

export const useLoadSerifFont = () => {
  useEffect(() => {
    loadStyleSheet(
      'https://fonts.loli.net/css?family=Noto+Serif+SC&display=swap',
    )
  }, [])
}
