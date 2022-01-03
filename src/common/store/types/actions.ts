export type FootAction = {
  id: symbol
  icon: JSX.Element
  onClick: () => void | Promise<void>
}
