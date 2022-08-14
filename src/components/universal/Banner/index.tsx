import { clsx } from 'clsx'
import type { FC } from 'react'

import {
  ClaritySuccessLine,
  FluentShieldError20Regular,
  FluentWarning28Regular,
  IonInformation,
} from '../Icons/status'

const IconMap = {
  warning: FluentWarning28Regular,
  info: IonInformation,
  error: FluentShieldError20Regular,
  success: ClaritySuccessLine,
}

const bgColorMap = {
  warning: 'bg-amber-50',
  info: 'bg-default-blue-50',
  success: 'bg-default-green-50',
  error: 'bg-default-red-50',
}

const borderColorMap = {
  warning: 'border-amber-300',
  info: 'border-default-blue-300',

  success: 'border-default-green-300',
  error: 'border-default-red-300',
}

const iconColorMap = {
  warning: 'text-amber-500',
  info: 'text-default-blue-500',
  success: 'text-default-green-500',
  error: 'text-default-red-500',
}

export const Banner: FC<{
  type: 'warning' | 'error' | 'success' | 'info'
  message?: string | React.ReactNode
  className?: string
  children?: React.ReactNode
  placement?: 'center' | 'left'
  showIcon?: boolean
}> = (props) => {
  const Icon = IconMap[props.type] || IconMap.info
  const { placement = 'center', showIcon = true } = props
  return (
    <div
      className={clsx(
        'phone:block p-6 flex items-center space-x-4 rounded-md border text-dark-100 ' +
          `${bgColorMap[props.type] || bgColorMap.info} ${
            borderColorMap[props.type] || borderColorMap.info
          }`,
        placement == 'center' ? 'justify-center' : 'justify-start',
        props.className,
      )}
    >
      {showIcon && (
        <Icon
          className={`text-3xl self-start flex-shrink-0 ${
            iconColorMap[props.type] || iconColorMap.info
          } mr-2 phone:float-left phone:-mr-2`}
        />
      )}
      {props.message ? (
        <span className="leading-[1.8]">{props.message}</span>
      ) : (
        props.children
      )}
    </div>
  )
}
