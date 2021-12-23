import { UUID } from 'utils'

export type FootAction = {
  id: UUID
  icon: JSX.Element
  onClick: () => void | Promise<void>
}
