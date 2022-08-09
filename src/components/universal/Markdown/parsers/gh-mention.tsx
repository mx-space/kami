import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  Priority,
  parseCaptureInline,
  simpleInlineRegex,
} from 'markdown-to-jsx'

import { CodiconGithubInverted } from '../../Icons/menu-icon'

// (GH@Innei)
export const GithubMentionRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(/^\((GH@(\w+\b))\)\s?(?!\[.*?\])/),
  order: Priority.MIN,
  parse: parseCaptureInline,
  react(node) {
    const { content } = node
    if (!content) {
      return <></>
    }

    const username = content[1]?.content?.replace(/^@/, '')

    if (!username) {
      return <></>
    }

    return (
      <div className="inline-flex items-center align-bottom space-x-2 mr-2">
        <CodiconGithubInverted />
        <a href={`https://github.com/${username}`}>{username}</a>
      </div>
    )
  },
}
