import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  Priority,
  parseCaptureInline,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import React from 'react'

//  ==Mark==
export const MarkRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(/^==((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)==/),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, output, state?) {
    return (
      <mark
        key={state?.key}
        className="!bg-none !bg-default-yellow-200 !bg-opacity-80 !text-black !rounded-lg"
      >
        {output(node.content, state!)}
      </mark>
    )
  },
}
