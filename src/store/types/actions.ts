export type FootAction = {
  id: string
  icon: React.ReactNode
  onClick: () => void | Promise<void>
  element?: JSX.Element
}
