import { observer } from 'mobx-react'
import React, { FC } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useStore } from '../../store'
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/tomorrow'

interface CodeBlockProps {
  language: string | undefined
  value: string
}
const CodeBlock: FC<CodeBlockProps> = observer((props) => {
  const { language, value } = props
  const { colorMode } = useStore().appStore
  return (
    <SyntaxHighlighter
      language={language}
      style={colorMode === 'dark' ? dark : undefined}
      customStyle={{
        background: 'var(--code-bg) !important',
      }}
    >
      {value}
    </SyntaxHighlighter>
  )
})
export default CodeBlock
