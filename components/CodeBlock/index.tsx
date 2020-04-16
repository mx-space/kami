import PropTypes from 'prop-types'
import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark'

export default class CodeBlock extends React.PureComponent<{
  language: string
  value: string
}> {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string,
  }

  static defaultProps = {
    language: null,
  }

  render() {
    const { language, value } = this.props

    return (
      <SyntaxHighlighter
        language={language}
        style={dark}
        customStyle={{
          background: 'none',
        }}
      >
        {value}
      </SyntaxHighlighter>
    )
  }
}
