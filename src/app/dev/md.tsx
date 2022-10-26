import { Markdown } from 'components/universal/Markdown'
import { useEffect, useState } from 'react'

export default function MD() {
  const [md, setMd] = useState('')
  useEffect(() => {
    fetch('/md.md')
      .then((res) => res.text())
      .then(setMd)
  }, [])
  return (
    <article>
      <Markdown>{md}</Markdown>
    </article>
  )
}
