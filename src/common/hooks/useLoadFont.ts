import { useEffect } from 'react'

export const useLoadFont = () => {
  useEffect(() => {
    const $link = document.createElement('link')
    $link.href =
      'https://cdn.jsdelivr.net/npm/@openfonts/noto-sans-sc_vietnamese@1.44.0/index.min.css'
    $link.rel = 'stylesheet'
    $link.type = 'text/css'
    document.head.appendChild($link)
    return () => {
      document.head.removeChild($link)
    }
  }, [])
}
