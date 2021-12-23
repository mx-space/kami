import CodeHighlighter from 'components/CodeHighlighter'
import { Mermaid } from 'components/Mermaid'
export const CodeBlock = (props: {
  language: string | undefined
  value: string
}) => {
  if (props.language === 'mermaid') {
    return <Mermaid {...props} />
  } else {
    return <CodeHighlighter {...props} />
  }
}
