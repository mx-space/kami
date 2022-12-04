import type { FC } from 'react'

export const MTableHead: FC<JSX.IntrinsicElements['thead']> = (props) => {
  const { children, ...rest } = props
  return <thead {...rest}>{children}</thead>
}

export const MTableRow: FC<JSX.IntrinsicElements['tr']> = (props) => {
  const { children, ...rest } = props
  return <tr {...rest}>{children}</tr>
}

export const MTableBody: FC<JSX.IntrinsicElements['tbody']> = (props) => {
  const { children, ...rest } = props
  return <tbody {...rest}>{children}</tbody>
}
