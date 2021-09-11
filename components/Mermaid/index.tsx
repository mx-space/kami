import { useEffect } from 'react'

export const Mermaid = (props) => {
  useEffect(() => {
    if (window.mermaid) {
      window.mermaid.initialize({
        theme: 'default',
        startOnLoad: false,
      })
      window.mermaid.init(undefined, '.mermaid')
    }
  }, [])
  return <div className="mermaid">{props.value}</div>
}
