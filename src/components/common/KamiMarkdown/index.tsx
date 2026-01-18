 
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { sanitizeUrl } from 'markdown-to-jsx'
import type { FC } from 'react'
import React, { Fragment, memo, useMemo } from 'react'

import { ErrorBoundary } from '~/components/app/ErrorBoundary'
import type { MdProps } from '~/components/ui/Markdown'
import { Markdown } from '~/components/ui/Markdown'
import { isDev } from '~/utils/env'
import { springScrollToElement } from '~/utils/spring'

import { CodeBlock } from '../CodeBlock'
import { MarkdownToc } from './MarkdownToc'
import { MHeading, MImage, MLink } from './renderers'
import { MFootNote } from './renderers/footnotes'
import { LinkCard } from './renderers/link-card'
import { SpoilderRule } from '~/components/ui/Markdown/parsers/spoiler'
import { MentionRule } from '~/components/ui/Markdown/parsers/mention'
import { CommentAtRule } from '~/components/ui/Markdown/parsers/comment-at'
import { MarkRule } from '~/components/ui/Markdown/parsers/mark'
import { InsertRule } from '~/components/ui/Markdown/parsers/ins'
import { KateXRule } from '~/components/ui/Markdown/parsers/katex'
import { ContainerRule } from '~/components/ui/Markdown/parsers/container'

const Noop = () => null

export interface KamiMarkdownProps extends MdProps {
  toc?: boolean
  additionalParserRules?: { [key: string]: Partial<MarkdownToJSX.Rule> }
}
export const KamiMarkdown: FC<KamiMarkdownProps & MarkdownToJSX.Options> = memo(
  (props) => {
    const {
      value,
      renderers,
      extendsRules,
      additionalParserRules,
      ...rest
    } = props

    const Heading = useMemo(() => {
      return MHeading()
    }, [value])

    return (
      <ErrorBoundary
        FallbackComponent={useMemo(
          () => () => <ErrorFallback value={value || ''} />,
          [value],
        )}
      >
        <Markdown
          tocSlot={props.toc ? MarkdownToc : Noop}
          value={value}
          additionalParserRules={{
            spoilder: SpoilderRule,
            mention: MentionRule,
            commentAt: CommentAtRule,
            mark: MarkRule,
            ins: InsertRule,
            kateX: KateXRule,
            container: ContainerRule,
            ...additionalParserRules,
          }}
          overrides={{
            footer: MFootNote,

            img: MImage,
            // for custom react component
            LinkCard,
          }}
          extendsRules={{
            link: {
              react(node, output, state) {
                const { target, title } = node
                return (
                  <MLink
                    href={sanitizeUrl(target)!}
                    title={title}
                    key={state?.key}
                  >
                    {output(node.content, state!)}
                  </MLink>
                )
              },
            },
            heading: {
              react(node, output, state) {
                return (
                  <Heading id={node.id} level={node.level} key={state?.key}>
                    {output(node.content, state!)}
                  </Heading>
                )
              },
            },
            footnoteReference: {
              react(node, output, state) {
                const { footnoteMap, target, content } = node
                const footnote = footnoteMap.get(content)
                const linkCardId = (() => {
                  try {
                    const thisUrl = new URL(
                      footnote?.footnote?.replace(': ', ''),
                    )
                    const isCurrentHost =
                      thisUrl.hostname === window.location.hostname

                    if (!isCurrentHost && !isDev) {
                      return undefined
                    }
                    const pathname = thisUrl.pathname
                    return pathname.slice(1)
                  } catch {
                    return undefined
                  }
                })()

                return (
                  <Fragment key={state?.key}>
                    <a
                      href={sanitizeUrl(target)!}
                      onClick={(e) => {
                        e.preventDefault()
                        springScrollToElement(
                          document.getElementById(content)!,
                          -window.innerHeight / 2,
                        )
                      }}
                    >
                      <sup key={state?.key}>^{content}</sup>
                    </a>
                    {linkCardId && <LinkCard id={linkCardId} source="self" />}
                  </Fragment>
                )
              },
            },
            codeBlock: {
              react(node, output, state) {
                return (
                  <CodeBlock
                    key={state?.key}
                    content={node.content}
                    lang={node.lang}
                  />
                )
              },
            },
            ...extendsRules,
            ...renderers,
          }}
          {...rest}
        />
      </ErrorBoundary>
    )
  },
)

const ErrorFallback = (props: { value: string }) => {
  const { value } = props
  return (
    <>
      <div className="bg-always-red-200 w-full px-4 py-2">
        Markdown 渲染出错
      </div>

      <div className="mt-4 px-4 leading-7">{value}</div>
    </>
  )
}
