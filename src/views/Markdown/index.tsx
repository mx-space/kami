import clsx from 'clsx'
import { useStore } from 'common/store'
import { range } from 'lodash-es'
import React, { ElementType, FC, RefObject, useEffect, useState } from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { ensuredForwardRef } from 'react-use'
import { observer } from 'utils/mobx'
import CustomRules from 'views/Markdown/rules'
import { Toc, TocHeading, TocProps } from 'views/Toc'
import { CodeBlock } from '../../components/CodeBlock'
import styles from './index.module.css'
import { processDetails } from './process-tag'
import {
  RenderCommentAt,
  RenderLink,
  RenderListItem,
  RenderParagraph,
  RenderReference,
  RenderSpoiler,
  RenderTableBody,
  RenderTableHead,
  RenderTableRow,
} from './renderers'
import { Heading } from './renderers/Heading'
import { Image } from './renderers/Image'

type MdProps = ReactMarkdownProps & {
  value: string
  toc?: boolean
  [key: string]: any
  style?: React.CSSProperties
  readonly renderers?: { [nodeType: string]: ElementType }
  wrapperProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  codeBlockFully?: boolean
}

export const Markdown: FC<MdProps> = observer(
  ensuredForwardRef<HTMLDivElement, MdProps>((props, ref) => {
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

    const [headings, setHeadings] = useState<TocHeading[]>([])

    useEffect(() => {
      const _ = ref as RefObject<HTMLElement>
      if (!_.current) {
        return
      }
      const $ = _.current
      const $headings = $.querySelectorAll(
        range(0, 6)
          .map((i) => `h${i}`)
          .join(', '),
      )
      const headings = Array.from($headings).map((el) => {
        const depth = +el.tagName.slice(1)
        const title = el.id

        return {
          depth,
          title,
        }
      })
      setHeadings(headings)
    }, [ref, value])

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
      >
        <ReactMarkdown
          source={value}
          // source={TestText}
          {...rest}
          renderers={{
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
          }}
          plugins={CustomRules}
        />

        {props.toc && <TOC headings={headings} />}
      </div>
    )
  }),
)

export const TOC: FC<TocProps> = observer((props) => {
  const { appStore } = useStore()
  const { isPadOrMobile } = appStore
  return !isPadOrMobile ? <Toc {...props} /> : null
})
