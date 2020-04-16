import React from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import CodeBlock from '../CodeBlock'

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
          }}
        />
      </div>
    )
  }
}

export default Markdown
