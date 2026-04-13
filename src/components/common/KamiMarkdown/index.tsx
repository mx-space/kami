 
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { sanitizeUrl } from 'markdown-to-jsx'
import type { FC } from 'react'
import React, { Fragment, memo, useMemo } from 'react'

import { ErrorBoundary } from '~/components/app/ErrorBoundary'
import type { MdProps } from '~/components/ui/Markdown'
import { Markdown } from '~/components/ui/Markdown'
import { springScrollToElement } from '~/utils/spring'

import { CodeBlock } from '../CodeBlock'
import { MarkdownToc } from './MarkdownToc'
import { MHeading, MImage, MLink } from './renderers'
import { MFootNote } from './renderers/footnotes'
import { LinkCard } from './renderers/link-card'

const Noop = () => null
const normalizeHostname = (hostname: string) =>
  hostname.toLowerCase().replace(/^www\./, '')
const stripFootnotePrefix = (value?: string) => value?.replace(/^:\s*/, '').trim()
const isSelfCardPath = (pathname: string) => {
  return /^notes\/\d+$/.test(pathname) || /^posts\/[^/]+\/[^/]+$/.test(pathname)
}

export interface KamiMarkdownProps extends MdProps {
  toc?: boolean
}
export const KamiMarkdown: FC<KamiMarkdownProps & MarkdownToJSX.Options> = memo(
  (props) => {
    const {
      value,
      renderers,

      extendsRules,

      ...rest
    } = props

    const Heading = useMemo(() => {
      return MHeading()
    }, [value, props.children])

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
                const linkCardInfo = (() => {
                  try {
                    const text = stripFootnotePrefix(footnote?.footnote)
                    if (!text) {
                      return {}
                    }

                    const thisUrl = new URL(text)
                    const isCurrentHost =
                      normalizeHostname(thisUrl.hostname) ===
                      normalizeHostname(window.location.hostname)

                    const pathname = thisUrl.pathname.replace(/^\/+/, '')
                    if (isCurrentHost && isSelfCardPath(pathname)) {
                      return { source: 'self' as const, id: pathname }
                    }

                    if (thisUrl.protocol === 'http:' || thisUrl.protocol === 'https:') {
                      return { source: 'external' as const, url: thisUrl.toString() }
                    }

                    return {}
                  } catch {
                    return {}
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
                    {linkCardInfo.source === 'self' && linkCardInfo.id && (
                      <LinkCard id={linkCardInfo.id} source="self" />
                    )}
                    {linkCardInfo.source === 'external' && linkCardInfo.url && (
                      <LinkCard id={linkCardInfo.url} source="external" url={linkCardInfo.url} />
                    )}
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
        >
          {props.children}
        </Markdown>
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
