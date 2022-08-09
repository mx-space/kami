import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  Priority,
  parseCaptureInline,
  simpleInlineRegex,
} from 'markdown-to-jsx'

// @
export const CommentAtRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(/^@(\w+)\s/),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node) {
    const { content } = node

    if (!content || !content[0]?.content) {
      return <></>
    }

    return <span>@{content[0]?.content}</span>
  },
}
