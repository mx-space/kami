import { clsx } from 'clsx'
import type { FC } from 'react'

import { FluentWarning28Regular } from '../Icons/status'

const IconMap = {
  warning: FluentWarning28Regular,
}

const bgColorMap = {
  warning: 'bg-amber-50',
}

const borderColorMap = {
  warning: 'border-amber-300',
}

const iconColorMap = {
  warning: 'text-amber-500',
}

// TODO
export const Banner: FC<{
  type: 'warning' | 'error' | 'success' | 'info'
  message?: string | React.ReactNode
  className?: string
  children?: React.ReactNode
}> = (props) => {
  const Icon = IconMap[props.type]
  return (
    <div
      className={clsx(
        'p-6 flex justify-center items-center space-x-4 rounded-md border text-dark-100 ' +
          `${bgColorMap[props.type]} ${borderColorMap[props.type]}`,
        props.className,
      )}
    >
      <Icon className={`text-3xl ${iconColorMap[props.type]}`} />
      {props.message ? (
        <span className="leading-[1.8]">{props.message}</span>
      ) : (
        props.children
      )}
    </div>
  )
}
