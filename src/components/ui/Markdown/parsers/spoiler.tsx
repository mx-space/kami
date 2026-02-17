import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  Priority,
  parseCaptureInline,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import React from 'react'
import { useTranslations } from 'next-intl'

const SpoilerWithTitle: React.FC<{
  node: unknown
  output: (content: unknown[], state: any) => React.ReactNode
  state?: any
}> = ({ node, output, state }) => {
  const t = useTranslations('common')
  const content = (node as { content?: unknown[] }).content ?? []
  return (
    <del className="spoiler" title={t('spoilerHint')}>
      {output(content, state!)}
    </del>
  )
}

// ||Spoilder||
export const SpoilderRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(
    /^\|\|((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)\|\|/,
  ),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, output, state?) {
    return (
      <SpoilerWithTitle
        key={state?.key}
        node={node}
        output={output}
        state={state}
      />
    )
  },
}
