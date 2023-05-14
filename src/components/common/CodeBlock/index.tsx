import { Mermaid } from '~/components/common/Mermaid'
import { HighLighter } from '~/components/widgets/CodeHighlighter'

export const CodeBlock = (props: {
  lang: string | undefined
  content: string
}) => {
  if (props.lang === 'mermaid') {
    return <Mermaid {...props} />
  } else {
    return <HighLighter {...props} />
  }
}
