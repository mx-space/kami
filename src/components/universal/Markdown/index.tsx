/* eslint-disable react-hooks/rules-of-hooks */
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { sanitizeUrl } from 'markdown-to-jsx'
import type { FC } from 'react'
import React, { Fragment, memo, useCallback, useMemo } from 'react'

import type { MdProps } from '@mx-space/kami-design/components/Markdown'
import { Markdown as KamiMarkdown } from '@mx-space/kami-design/components/Markdown'

import { ErrorBoundary } from '~/components/app/ErrorBoundary'
import { isDev } from '~/utils/env'
import { springScrollToElement } from '~/utils/spring'

import { CodeBlock } from '../CodeBlock'
import { MarkdownToc } from './MarkdownToc'
import { MHeading, MImage, MLink } from './renderers'
import { MFootNote } from './renderers/footnotes'
import { LinkCard } from './renderers/link-card'

const Noop = () => null

export interface KamiMarkdownProps extends MdProps {
  toc?: boolean
}
export const Markdown: FC<KamiMarkdownProps & MarkdownToJSX.Options> = memo(
  (props) => {
    const {
      value,
      renderers,

      wrapperProps = {},

      extendsRules,

      ...rest
    } = props

    const Heading = useMemo(() => {
      return MHeading()
    }, [value, props.children])

    const RenderError = useCallback(
      () => (
        <div>
          Markdown RenderError, Raw: <br /> {value || props.children}
        </div>
      ),
      [props.children, value],
    )

    return (
      <ErrorBoundary fallbackComponent={RenderError}>
        <KamiMarkdown
          tocSlot={props.toc ? MarkdownToc : Noop}
          {...wrapperProps}
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
                          undefined,
                          -window.innerHeight / 2,
                        )
                      }}
                    >
                      <sup key={state?.key}>^{content}</sup>
                    </a>
                    {linkCardId && <LinkCard id={linkCardId} source={'self'} />}
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
        </KamiMarkdown>
      </ErrorBoundary>
    )
  },
)
