import { clsx } from 'clsx'
import type { FC } from 'react'

import { FluentInfo12Regular, FluentWarning28Regular } from '../Icons/status'

const IconMap = {
  warning: FluentWarning28Regular,
  info: FluentInfo12Regular,
}

const bgColorMap = {
  warning: 'bg-amber-50',
  info: 'bg-default-blue-50',
}

const borderColorMap = {
  warning: 'border-amber-300',
  info: 'border-default-blue-300',
}

const iconColorMap = {
  warning: 'text-amber-500',
  info: 'text-default-blue-500',
}

// TODO
export const Banner: FC<{
  type: 'warning' | 'error' | 'success' | 'info'
  message?: string | React.ReactNode
  className?: string
  children?: React.ReactNode
  placement?: 'center' | 'left'
  showIcon?: boolean
}> = (props) => {
  const Icon = IconMap[props.type]
  const { placement = 'center', showIcon = true } = props
  return (
    <div
      className={clsx(
        'p-6 flex items-center space-x-4 rounded-md border text-dark-100 ' +
          `${bgColorMap[props.type]} ${borderColorMap[props.type]}`,
        placement == 'center' ? 'justify-center' : 'justify-start',
        props.className,
      )}
    >
      {showIcon && <Icon className={`text-3xl ${iconColorMap[props.type]}`} />}
      {props.message ? (
        <span className="leading-[1.8]">{props.message}</span>
      ) : (
        props.children
      )}
    </div>
  )
}
