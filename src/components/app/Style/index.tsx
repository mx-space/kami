export const Style: React.FC<{
  content: string
}> = ({ content }) => {
  return (
    <link
      type="text/css"
      rel="stylesheet"
      href={`data:text/css;base64,${Buffer.from(content).toString('base64')}`}
    />
  )
}
