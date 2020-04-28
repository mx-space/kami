import React from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import CodeBlock from '../CodeBlock'
import dynamic from 'next/dynamic'
import { ImageLazy } from 'components/Image'
// const ImageLazy = dynamic(
//   () => import('components/Image').then((mo) => mo.ImageLazy as any),
//   {
//     ssr: false,
//   },
// )
interface MdProps extends ReactMarkdownProps {
  value: string
  [key: string]: any
}

class Markdown extends React.PureComponent<MdProps> {
  render() {
    const { value, ...rest } = this.props
    return (
      <div id="write">
        <ReactMarkdown
          source={value}
          {...rest}
          renderers={{
            code: CodeBlock,
            pre: CodeBlock,
            image: ImageLazy,
          }}
        />
      </div>
    )
  }
}

export default Markdown
