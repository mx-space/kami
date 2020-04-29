import { ImageLazyWithPopup } from 'components/Image'

import React, {
  FC,
  createElement,
  DOMAttributes,
  memo,
  HTMLAttributes,
} from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import CodeBlock from '../CodeBlock'
import dynamic from 'next/dynamic'
import Toc from 'components/Toc'

interface MdProps extends ReactMarkdownProps {
  value: string
  showTOC?: boolean
  [key: string]: any
}

const Heading: FC<{ level: 1 | 2 | 3 | 4 | 5 | 6; key?: number }> = (props) => {
  return createElement<DOMAttributes<HTMLHeadingElement>, HTMLHeadingElement>(
    `h${props.level}`,
    { key: props.key, id: props.children?.[0].props.value } as any,
    props.children,
  )
}

const Markdown: FC<MdProps> = (props) => {
  const { value, ...rest } = props

  return (
    <>
      <div id="write">
        <ReactMarkdown
          source={value}
          {...rest}
          renderers={{
            code: CodeBlock,
            pre: CodeBlock,
            image: ImageLazyWithPopup,
            heading: Heading,
          }}
        />
        {props.showTOC ? <Toc /> : null}
      </div>
    </>
  )
}

export default memo(Markdown)
