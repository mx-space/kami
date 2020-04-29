import { ImageLazyWithPopup } from 'components/Image'
import React from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import CodeBlock from '../CodeBlock'
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
            image: ImageLazyWithPopup,
          }}
        />
      </div>
    )
  }
}

export default Markdown
