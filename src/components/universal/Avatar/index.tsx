import { clsx } from 'clsx'
import rc from 'randomcolor'
import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react'
import { createElement, memo, useMemo, useRef, useState } from 'react'

import { FlexText } from '../FlexText'
import styles from './index.module.css'

interface AvatarProps {
  url?: string
  imageUrl?: string
  size?: number

  wrapperProps?: JSX.IntrinsicElements['div']

  useRandomColor?: boolean
  shadow?: boolean
  text?: string

  lazy?: boolean
}

export const Avatar: FC<
  AvatarProps &
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = memo((props) => {
  const { useRandomColor = true, shadow = true, lazy = true } = props
  const avatarRef = useRef<HTMLDivElement>(null)
  const randomColor = useMemo(
    () =>
      useRandomColor
        ? rc({ luminosity: 'light', seed: props.src })
        : 'var(--gray)',
    [props.src, useRandomColor],
  )
  const [loaded, setLoaded] = useState(!lazy)

  const { wrapperProps = {} } = props
  const { className, ...restProps } = wrapperProps

  return (
    <div
      className={clsx(
        styles['avatar-wrap'],
        shadow && styles['shadow'],
        className,
      )}
      ref={avatarRef}
      style={
        props.size
          ? { height: `${props.size}px`, width: `${props.size}px` }
          : undefined
      }
      {...restProps}
    >
      {createElement(
        props.url ? 'a' : 'div',
        {
          style: { backgroundColor: loaded ? undefined : randomColor },
          className: styles['avatar'],

          ...(props.url
            ? {
                href: props.url,
                target: '_blank',
                rel: 'noreferrer',
              }
            : {}),
        },
        props.imageUrl ? (
          <div className={styles['image']} style={{ opacity: loaded ? 1 : 0 }}>
            <img
              src={props.imageUrl}
              height={props.size}
              width={props.size}
              onLoad={() => setLoaded(true)}
              loading={lazy ? 'lazy' : 'eager'}
              className="aspect-square"
            />
          </div>
        ) : props.text ? (
          <div className="flex flex-grow relative h-full w-full items-center justify-center">
            <FlexText size={0.8} text={props.text} />
          </div>
        ) : null,
      )}
    </div>
  )
})
