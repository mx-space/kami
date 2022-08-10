import type { FC } from 'react'

export const MTableHead: FC = (props) => {
  return <thead>{props.children}</thead>
}

export const MTableRow: FC = (props) => {
  return <tr>{props.children}</tr>
}

export const MTableBody: FC = (props) => {
  return <tbody>{props.children}</tbody>
}
