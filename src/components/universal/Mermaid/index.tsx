import type { FC } from 'react'
import { useInsertionEffect } from 'react'

import { loadScript } from '~/utils/load-script'

export const Mermaid: FC<{ content: string }> = (props) => {
  useInsertionEffect(() => {
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
  return <div className="mermaid">{props.content}</div>
}
