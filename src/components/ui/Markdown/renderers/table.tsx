import { clsx } from 'clsx'
import type { FC } from 'react'
import React from 'react'

export const MTableHead: FC<JSX.IntrinsicElements['thead']> = (props) => {
  const { children, className, ...rest } = props
  return (
    <thead
      className={clsx(
        className,
        'bg-primary text-dark-800 dark:text-light-100 opacity-80',
      )}
      {...rest}
    >
      {children}
    </thead>
  )
}

export const MTableRow: FC<JSX.IntrinsicElements['tr']> = (props) => {
  const { children, ...rest } = props
  return <tr {...rest}>{children}</tr>
}

export const MTableBody: FC<JSX.IntrinsicElements['tbody']> = (props) => {
  const { children, ...rest } = props
  return <tbody {...rest}>{children}</tbody>
}
