import type { FC } from 'react'

export const RenderTableHead: FC = (props) => {
  return <thead>{props.children}</thead>
}

export const RenderTableRow: FC = (props) => {
  return <tr>{props.children}</tr>
}

export const RenderTableBody: FC = (props) => {
  return <tbody>{props.children}</tbody>
}
