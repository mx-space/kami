import type { FC } from 'react'
import { memo } from 'react'

import { Markdown } from '~/components/universal/Markdown'

const renderLines: FC<{ value: string }> = ({ value }) => {
  return <span className="indent">{value}</span>
}

const Markdownrenderers = { text: renderLines }

export const NoteMarkdownRender = memo((props: { text: string }) => {
  return (
    <Markdown
      value={props.text}
      escapeHtml={false}
      renderers={Markdownrenderers}
      toc
    />
  )
})
