import clsx from 'clsx'
import CustomRules from 'common/markdown/rules'
import React, { ElementType, FC, RefObject, useEffect } from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { ensuredForwardRef } from 'react-use'
import { observer } from 'utils/mobx'
import { CodeBlock } from '../../components/CodeBlock'
import { Heading } from './Heading'
import { Image } from './Image'
import styles from './index.module.css'
import { RenderLink } from './Link'
import {
  RenderCommentAt,
  RenderParagraph,
  RenderReference,
  RenderSpoiler,
  _TOC,
} from './Other'
import { processDetails } from './process-tag'
type MdProps = ReactMarkdownProps & {
  value: string
  toc?: boolean
  [key: string]: any
  style?: React.CSSProperties
  readonly renderers?: { [nodeType: string]: ElementType }
  warpperProps?: React.DetailedHTMLProps<
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
      warpperProps = {},
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
    return (
      <div
        id="write"
        style={style}
        {...warpperProps}
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
            ...renderers,
          }}
          // astPlugins={[mermaid]}
          plugins={CustomRules}
        />

        {props.toc && <_TOC />}
      </div>
    )
  }),
)
