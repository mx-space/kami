import { useEffect } from 'react'
import { loadScript } from 'utils/load-script'

export const Mermaid = (props) => {
  useEffect(() => {
    loadScript('https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js').then(
      () => {
        if (window.mermaid) {
          window.mermaid.initialize({
            theme: 'default',
            startOnLoad: false,
          })
          window.mermaid.init(undefined, '.mermaid')
        }
      },
    )
  }, [])
  return <div className="mermaid">{props.value}</div>
}
