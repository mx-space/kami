import CodeHighlighter from 'components/universal/CodeHighlighter'
import { Mermaid } from 'components/universal/Mermaid'
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
