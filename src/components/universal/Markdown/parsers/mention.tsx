import type { MarkdownToJSX } from 'markdown-to-jsx'
import { Priority, simpleInlineRegex } from 'markdown-to-jsx'

import {
  CodiconGithubInverted,
  IcBaselineTelegram,
  MdiTwitter,
} from '../../Icons/menu-icon'

const prefixToIconMap = {
  GH: <CodiconGithubInverted />,
  TW: <MdiTwitter />,
  TG: <IcBaselineTelegram />,
}

const prefixToUrlMap = {
  GH: 'https://github.com/',
  TW: 'https://twitter.com/',
  TG: 'https://t.me/',
}

// {GH@Innei} {TW@Innei} {TG@Innei}
export const MentionRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(
    /^\{((?<prefix>(GH)|(TW)|(TG))@(?<name>\w+\b))\}\s?(?!\[.*?\])/,
  ),
  order: Priority.MIN,
  parse(capture) {
    const { groups } = capture

    if (!groups) {
      return {}
    }
    return {
      content: { prefix: groups.prefix, name: groups.name },
      type: 'mention',
    }
  },
  react(result, _, state) {
    const { content } = result
    if (!content) {
      return null as any
    }

    const { prefix, name } = content
    if (!name) {
      return null as any
    }

    const Icon = prefixToIconMap[prefix]
    const urlPrefix = prefixToUrlMap[prefix]

    return (
      <div
        className="inline-flex items-center align-bottom space-x-2 mr-2"
        key={state?.key}
      >
        {Icon}
        <a
          target={'_blank'}
          rel="noreferrer nofollow"
          href={`${urlPrefix}${name}`}
        >
          {name}
        </a>
      </div>
    )
  },
}
