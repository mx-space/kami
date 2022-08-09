import type { MarkdownToJSX } from 'markdown-to-jsx'
import { memo } from 'react'

import { Markdown } from '~/components/universal/Markdown'

const Markdownrenderers: { [name: string]: Partial<MarkdownToJSX.Rule> } = {
  text: {
    react(node) {
      return <span className="indent">{node.content}</span>
    },
  },
}

export const NoteMarkdownRender = memo((props: { text: string }) => {
  return (
    <Markdown
      value={props.text}
      disableParsingRawHTML
      renderers={Markdownrenderers}
      toc
    />
  )
})
