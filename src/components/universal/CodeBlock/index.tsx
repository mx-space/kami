import { Mermaid } from '~/components/universal/Mermaid'
import { HighLighter } from '~/components/widgets/CodeHighlighter'

export const CodeBlock = (props: {
  language: string | undefined
  value: string
}) => {
  if (props.language === 'mermaid') {
    return <Mermaid {...props} />
  } else {
    return <HighLighter {...props} />
  }
}
