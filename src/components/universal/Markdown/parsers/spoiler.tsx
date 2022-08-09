import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  Priority,
  parseCaptureInline,
  simpleInlineRegex,
} from 'markdown-to-jsx'

// ||Test||
export const SpoilderRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(
    /^\|\|((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)\|\|/,
  ),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, output, state?) {
    return (
      <del key={state?.key} className={'spoiler'} title={'你知道的太多了'}>
        {output(node.content, state!)}
      </del>
    )
  },
}
