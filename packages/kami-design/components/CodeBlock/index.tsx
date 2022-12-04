import { Mermaid } from '../Mermaid'

export const CodeBlock = (props: {
  lang: string | undefined
  content: string

  HighLighter: React.ComponentType<{
    content: string
    lang: string | undefined
  }>
}) => {
  const { HighLighter } = props
  if (props.lang === 'mermaid') {
    return <Mermaid {...props} />
  } else {
    return <HighLighter {...props} />
  }
}
