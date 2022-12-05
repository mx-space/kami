/* eslint-disable react-hooks/rules-of-hooks */
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { sanitizeUrl } from 'markdown-to-jsx'
import { observer } from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React, { Fragment, memo, useCallback, useEffect, useMemo } from 'react'

import type { MdProps } from '@mx-space/kami-design/components/Markdown'
import { Markdown as KamiMarkdown } from '@mx-space/kami-design/components/Markdown'

import { ErrorBoundary } from '~/components/app/ErrorBoundary'
import type { TocProps } from '~/components/widgets/Toc'
import { useStore } from '~/store'
import { isDev } from '~/utils/env'
import { springScrollToElement } from '~/utils/spring'

import { CodeBlock } from '../CodeBlock'
import { FloatPopover } from '../FloatPopover'
import { FluentList16Filled } from '../Icons/shared'
import { useModalStack } from '../Modal/stack.context'
import { MHeading, MImage, MLink } from './renderers'
import { MFootNote } from './renderers/footnotes'
import { LinkCard } from './renderers/link-card'

const Toc = dynamic(
  () => import('~/components/widgets/Toc').then((m) => m.Toc),
  {
    ssr: false,
  },
)

export const Markdown: FC<MdProps & MarkdownToJSX.Options> = memo((props) => {
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
        tocSlot={
          props.toc ? ({ headings }) => <TOC headings={headings} /> : () => null
        }
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
                  const thisUrl = new URL(footnote?.footnote?.replace(': ', ''))
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
                  {linkCardId && (
                    <LinkCard
                      id={linkCardId}
                      source={'self'}
                      // className="float-right"
                    />
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
      </KamiMarkdown>
    </ErrorBoundary>
  )
})

export const TOC: FC<TocProps> = observer((props) => {
  const { appStore, actionStore } = useStore()
  const {
    isNarrowThanLaptop,
    viewport: { mobile },
  } = appStore
  const { present } = useModalStack()

  useEffect(() => {
    if (!isNarrowThanLaptop || props.headings.length == 0) {
      return
    }

    const InnerToc = () => <Toc {...props} useAsWeight />
    const id = 'toc'
    actionStore.appendActions({
      element: !mobile ? (
        <FloatPopover
          placement="left-end"
          strategy="fixed"
          wrapperClassNames="flex flex-1"
          offset={20}
          triggerComponent={() => (
            <button aria-label="toc button">
              <FluentList16Filled />
            </button>
          )}
          trigger="click"
        >
          <InnerToc />
        </FloatPopover>
      ) : undefined,
      icon: mobile ? <FluentList16Filled /> : null,
      id,
      onClick() {
        present({
          component: <InnerToc />,

          modalProps: {
            title: 'Table of Content',
            noBlur: true,
          },
        })
      },
    })
    return () => {
      actionStore.removeActionById(id)
    }
  }, [actionStore, isNarrowThanLaptop, mobile, present, props])
  return !isNarrowThanLaptop ? <Toc {...props} /> : null
})
