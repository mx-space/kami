import { clsx } from 'clsx'
import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'

export const Divider: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>
> = (props) => {
  const { className, ...rest } = props
  return (
    <hr
      className={clsx(
        'border-0 h-[0.5px] my-4 !bg-opacity-30 bg-black dark:bg-white',
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
        '!bg-opacity-30 bg-black dark:bg-white inline-block h-full mx-4 w-[0.5px] text-transparent',
        className,
      )}
      {...rest}
    >
      w
    </span>
  )
}
