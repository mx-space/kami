import { useEffect } from 'react'

import { loadScript } from '~/utils/load-script'

export const Mermaid = (props) => {
  useEffect(() => {
    loadScript(
      'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/mermaid/8.9.0/mermaid.min.js',
    ).then(() => {
      if (window.mermaid) {
        window.mermaid.initialize({
          theme: 'default',
          startOnLoad: false,
        })
        window.mermaid.init(undefined, '.mermaid')
      }
    })
  }, [])
  return <div className="mermaid">{props.value}</div>
}
