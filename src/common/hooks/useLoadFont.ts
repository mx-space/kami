import { useEffect } from 'react'

export const useLoadSerifFont = () => {
  useEffect(() => {
    const $link = document.createElement('link')
    $link.href = 'https://fonts.loli.net/css?family=Noto+Serif+SC&display=swap'
    $link.rel = 'stylesheet'
    $link.type = 'text/css'
    document.head.appendChild($link)
    return () => {
      document.head.removeChild($link)
    }
  }, [])
}
