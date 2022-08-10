/* eslint-disable react-hooks/rules-of-hooks */
import { clsx } from 'clsx'
import range from 'lodash-es/range'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { compiler, sanitizeUrl } from 'markdown-to-jsx'
import { observer } from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import type { FC, RefObject } from 'react'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { ensuredForwardRef } from 'react-use'

import type { TocProps } from '~/components/widgets/Toc'
import { useStore } from '~/store'
import { springScrollToElement } from '~/utils/spring'

import { CodeBlock } from '../CodeBlock'
import { BiListNested } from '../Icons/shared'
import { useModalStack } from '../Modal/stack.context'
import styles from './index.module.css'
import { CommentAtRule } from './parsers/comment-at'
import { MentionRule } from './parsers/mention'
import { SpoilderRule } from './parsers/spoiler'
import {
  MHeading,
  MImage,
  MLink,
  MParagraph,
  MTableBody,
  MTableHead,
  MTableRow,
} from './renderers'
import { MDetails } from './renderers/collapse'
import { MFootNote } from './renderers/footnotes'
import { LinkCard, LinkCardSource } from './renderers/link-card'

const Toc = dynamic(
  () => import('~/components/widgets/Toc').then((m) => m.Toc),
  {
    ssr: false,
  },
)
interface MdProps {
  value?: string
  toc?: boolean

  style?: React.CSSProperties
  readonly renderers?: { [key: string]: Partial<MarkdownToJSX.Rule> }
  wrapperProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  codeBlockFully?: boolean
  className?: string
}

export const Markdown: FC<MdProps & MarkdownToJSX.Options> = memo(
  ensuredForwardRef<HTMLDivElement, MdProps>((props, ref) => {
    const {
      value,
      renderers,
      style,
      wrapperProps = {},
      codeBlockFully = false,
      className,
    } = props

    const [headings, setHeadings] = useState<HTMLElement[]>([])

    useEffect(() => {
      const _ = ref as RefObject<HTMLElement>
      if (!_.current) {
        return
      }
      const $ = _.current
      // FIXME: 可能存在 memory leak

      setHeadings(
        Array.from(
          $.querySelectorAll(
            range(0, 6)
              .map((i) => `h${i}`)
              .join(', '),
          ),
        ),
      )
    }, [ref, value])

    const node = useMemo(() => {
      if (!value && typeof props.children != 'string') return null

      const Heading = MHeading()

      return compiler(`${value || props.children}`, {
        wrapper: null,
        overrides: {
          p: MParagraph,
          img: MImage,
          thead: MTableHead,
          tr: MTableRow,
          tbody: MTableBody,
          footer: MFootNote,
          details: MDetails,
        },
        extendsRules: {
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
          // TODO
          // footnote: {
          //   parse(capture) {
          //     footnotes.set(capture[1], {
          //       footnote: capture[2].replace(': ', ''),
          //       id: capture[1],
          //     })

          //     return {}
          //   },
          // },
          footnoteReference: {
            react(node, output, state) {
              return (
                <a
                  key={state?.key}
                  href={sanitizeUrl(node.target)!}
                  onClick={(e) => {
                    e.preventDefault()

                    springScrollToElement(
                      document.getElementById(node.content)!,
                      undefined,
                      -window.innerHeight / 2,
                    )
                  }}
                >
                  <sup key={state?.key}>{node.content}</sup>
                </a>
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
          gfmTask: {
            react(node, _, state) {
              return (
                <label
                  className="inline-flex items-center mr-2"
                  key={state?.key}
                >
                  <input type="checkbox" checked={node.completed} readOnly />
                </label>
              )
            },
          },

          list: {
            react(node, output, state) {
              const Tag = node.ordered ? 'ol' : 'ul'

              return (
                <Tag key={state?.key} start={node.start}>
                  {node.items.map((item, i) => {
                    let className = ''
                    if (item[0]?.type == 'gfmTask') {
                      className = 'list-none flex items-center'
                    }

                    return (
                      <li className={className} key={i}>
                        {output(item, state!)}
                      </li>
                    )
                  })}
                </Tag>
              )
            },
          },

          ...renderers,
        },
        additionalParserRules: {
          spoilder: SpoilderRule,
          mention: MentionRule,
          commentAt: CommentAtRule,
        },
      })
    }, [value, props.children, renderers])

    return (
      <div
        id="write"
        style={style}
        {...wrapperProps}
        ref={ref}
        className={clsx(
          styles['md'],
          codeBlockFully ? styles['code-fully'] : undefined,
        )}
        suppressHydrationWarning
      >
        <LinkCard link="" source={LinkCardSource.Self} />
        {className ? <div className={className}>{node}</div> : node}

        {props.toc && <TOC headings={headings} />}
      </div>
    )
  }),
)

export const TOC: FC<TocProps> = observer((props) => {
  const { appStore, actionStore } = useStore()
  const { isNarrowThanLaptop } = appStore
  const { present } = useModalStack()
  useEffect(() => {
    if (!isNarrowThanLaptop || props.headings.length == 0) {
      return
    }
    const id = Symbol('toc')
    actionStore.appendActions({
      icon: <BiListNested />,
      id,
      onClick() {
        present({
          component: <Toc useAsWeight {...props} />,
          modalProps: {
            title: 'Table of Content',
            noBlur: true,
          },
        })
      },
    })
    return () => {
      actionStore.removeActionBySymbol(id)
    }
  }, [actionStore, isNarrowThanLaptop, present, props])
  return !isNarrowThanLaptop ? <Toc {...props} /> : null
})
