import { clsx } from 'clsx'
import React from 'react'
import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'

export const Divider: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>
> = (props) => {
  const { className, ...rest } = props
  return (
    <hr
      className={clsx(
        'my-4 h-[0.5px] border-0 bg-black !bg-opacity-30 dark:bg-white',
        className,
      )}
      {...rest}
    />
  )
}

export const DividerVertical: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
> = (props) => {
  const { className, ...rest } = props
  return (
    <span
      className={clsx(
        'mx-4 inline-block h-full w-[0.5px] bg-black !bg-opacity-30 text-transparent dark:bg-white',
        className,
      )}
      {...rest}
    >
      w
    </span>
  )
}
