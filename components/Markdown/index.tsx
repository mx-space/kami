import CustomRules from 'common/markdown/rules'
import React, { ElementType, FC, forwardRef } from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { observer } from 'utils/mobx'
import CodeBlock from '../CodeHighlighter'
import { Image } from './Image'
import { Heading } from './Heading'
import styles from './index.module.scss'
import { RenderLink } from './Link'
import { RenderSpoiler, RenderParagraph, RenderCommentAt, _TOC } from './Other'

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
  forwardRef<HTMLDivElement, MdProps>((props, ref) => {
    const {
      value,
      renderers,
      style,
      warpperProps = {},
      codeBlockFully = false,
      ...rest
    } = props

    return (
      <div
        id="write"
        style={style}
        {...warpperProps}
        ref={ref}
        className={codeBlockFully ? styles['code-fully'] : undefined}
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
            // eslint-disable-next-line react/display-name
            commentAt: RenderCommentAt,
            ...renderers,
          }}
          plugins={CustomRules}
        />

        {props.toc && <_TOC />}
      </div>
    )
  }),
)

export default Markdown
