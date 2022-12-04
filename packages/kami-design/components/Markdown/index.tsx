/* eslint-disable react-hooks/rules-of-hooks */
import { clsx } from 'clsx'
import range from 'lodash-es/range'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { compiler, sanitizeUrl } from 'markdown-to-jsx'
import type { FC } from 'react'
import React, {
  Fragment,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { isDev } from '~/utils/env'
import { springScrollToElement } from '~/utils/spring'

import { CodeBlock } from '../CodeBlock'
import styles from './index.module.css'
import { CommentAtRule } from './parsers/comment-at'
import { ContainerRule } from './parsers/container'
import { InsertRule } from './parsers/ins'
import { KateXRule } from './parsers/katex'
import { MarkRule } from './parsers/mark'
import { MentionRule } from './parsers/mention'
import { SpoilderRule } from './parsers/spoiler'
import {
  MHeading,
  MImage,
  MParagraph,
  MTableBody,
  MTableHead,
  MTableRow,
} from './renderers'
import { MDetails } from './renderers/collapse'
import { MFootNote } from './renderers/footnotes'

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
  HighLighter: React.ComponentType<{
    content: string
    lang: string | undefined
  }>
}

export const Markdown: FC<MdProps & MarkdownToJSX.Options> = memo((props) => {
  const {
    value,
    renderers,
    style,
    wrapperProps = {},
    codeBlockFully = false,
    className,
    overrides,
    extendsRules,
    additionalParserRules,

    ...rest
  } = props

  const [headings, setHeadings] = useState<HTMLElement[]>([])

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) {
      return
    }

    const $headings = ref.current.querySelectorAll(
      range(1, 6)
        .map((i) => `h${i}`)
        .join(','),
    ) as NodeListOf<HTMLHeadingElement>

    setHeadings(Array.from($headings))

    return () => {
      setHeadings([])
    }
  }, [value, props.children])

  const node = useMemo(() => {
    if (!value && typeof props.children != 'string') return null

    const Heading = MHeading()

    const mdElement = compiler(`${value || props.children}`, {
      wrapper: null,
      // @ts-ignore
      overrides: {
        p: MParagraph,
        img: MImage,
        thead: MTableHead,
        tr: MTableRow,
        tbody: MTableBody,
        // FIXME: footer tag in raw html will renders not as expected, but footer tag in this markdown lib will wrapper as linkReferer footnotes
        footer: MFootNote,
        details: MDetails,

        // for custom react component
        // LinkCard,
        ...overrides,
      },

      extendsRules: {
        link: {
          // @ts-ignore
          react(node, output, state) {
            const { target, title } = node
            return null
            // <MLink href={sanitizeUrl(target)!} title={title} key={state?.key}>
            //   {output(node.content, state!)}
            // </MLink>
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
                HighLighter={props.HighLighter}
              />
            )
          },
        },
        gfmTask: {
          react(node, _, state) {
            return (
              <label className="inline-flex items-center mr-2" key={state?.key}>
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

        ...extendsRules,
        ...renderers,
      },
      additionalParserRules: {
        spoilder: SpoilderRule,
        mention: MentionRule,
        commentAt: CommentAtRule,
        mark: MarkRule,
        ins: InsertRule,
        kateX: KateXRule,
        container: ContainerRule,
        ...additionalParserRules,
      },
      ...rest,
    })

    return mdElement
  }, [
    value,
    props.children,
    overrides,
    extendsRules,
    renderers,
    additionalParserRules,
    rest,
  ])

  return (
    <div
      id="write"
      style={style}
      {...wrapperProps}
      ref={ref}
      className={clsx(
        styles['md'],
        codeBlockFully ? styles['code-fully'] : undefined,
        wrapperProps.className,
      )}
    >
      {className ? <div className={className}>{node}</div> : node}
    </div>
  )
})
