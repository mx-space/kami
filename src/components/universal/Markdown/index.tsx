import { clsx } from 'clsx'
import range from 'lodash-es/range'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { compiler } from 'markdown-to-jsx'
import { observer } from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import type { FC, RefObject } from 'react'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { ensuredForwardRef } from 'react-use'

import type { TocProps } from '~/components/widgets/Toc'
import { useStore } from '~/store'

import { CodeBlock } from '../CodeBlock'
import { BiListNested } from '../Icons/shared'
import { useModalStack } from '../Modal/stack.context'
import styles from './index.module.css'
import { processDetails } from './process-tag'
import {
  MHeading,
  MImage,
  MLink,
  MParagraph,
  MTableBody,
  MTableHead,
  MTableRow,
} from './renderers'

const Toc = dynamic(
  () => import('~/components/widgets/Toc').then((m) => m.Toc),
  {
    ssr: false,
  },
)
interface MdProps {
  value?: string
  toc?: boolean
  [key: string]: any
  style?: React.CSSProperties
  readonly renderers?: Partial<MarkdownToJSX.Rules>
  wrapperProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  codeBlockFully?: boolean
  children?: string
}

const __Markdown: FC<MdProps & MarkdownToJSX.Options> = ensuredForwardRef<
  HTMLDivElement,
  MdProps
>((props, ref) => {
  const {
    value,
    renderers,
    style,
    wrapperProps = {},
    codeBlockFully = false,
    ...rest
  } = props

  useEffect(() => {
    const _ = ref as RefObject<HTMLElement>
    if (!_.current) {
      return
    }
    const $ = _.current as HTMLElement
    //  process raw html tag
    processDetails($)
  }, [ref])

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
    const footnotes: {
      footnote: string
      id: string
    }[] = []
    const Heading = MHeading()

    return compiler(value || '', {
      wrapper: null,
      overrides: {
        p: MParagraph,
        img: MImage,
        a: MLink,
        thead: MTableHead,
        tr: MTableRow,
        tbody: MTableBody,
      },
      extendsRules: {
        heading: {
          react(node, output, state) {
            return (
              <Heading id={node.id} level={node.level}>
                {output(node.content, state!)}
              </Heading>
            )
          },
        },
        footnote: {
          parse(capture) {
            footnotes.push({
              footnote: capture[2].replace(': ', ''),
              id: capture[1],
            })

            return {}
          },
        },
        footnoteReference: {
          react(node, output, state) {
            const { content: id } = node

            return (
              <sup>
                <a title={id || undefined} href={footnotes[+id].footnote}>
                  {id}
                </a>
              </sup>
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
        ...renderers,
      },
      additionalParserRules: {},
    })
  }, [value, renderers])

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
      {node}
      {/* <ReactMarkdown
          source={value ?? (props.children as string)}
          // source={TestText}
          {...rest}
          renderers={useMemo(
            () => ({
              code: CodeBlock,
              pre: CodeBlock,
              image: Image,
              heading: Heading(),
              link: RenderLink,
              spoiler: RenderSpoiler,
              paragraph: RenderParagraph,
              commentAt: RenderCommentAt,
              linkReference: RenderReference,
              listItem: RenderListItem,
              tableHead: RenderTableHead,
              tableRow: RenderTableRow,
              tableBody: RenderTableBody,
              ...renderers,
            }),
            [renderers],
          )}
          plugins={CustomRules}
        /> */}

      {props.toc && <TOC headings={headings} />}
    </div>
  )
})

export const Markdown = memo(__Markdown)

export const TOC: FC<TocProps> = observer((props) => {
  const { appStore, actionStore } = useStore()
  const { isNarrowThanLaptop: isWiderThanLaptop } = appStore
  const { present } = useModalStack()
  useEffect(() => {
    if (!isWiderThanLaptop || props.headings.length == 0) {
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
  }, [actionStore, isWiderThanLaptop, present, props])
  return !isWiderThanLaptop ? <Toc {...props} /> : null
})
