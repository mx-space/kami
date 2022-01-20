import clsx from 'clsx'
import rc from 'randomcolor'
import {
  createElement,
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from './index.module.css'
interface AvatarProps {
  url?: string
  imageUrl: string
  size?: number

  wrapperProps?: JSX.IntrinsicElements['div']
}

export const Avatar: FC<
  AvatarProps &
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = memo((props) => {
  const avatarRef = useRef<HTMLDivElement>(null)
  const randomColor = useMemo(() => rc({ luminosity: 'light' }), [])
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const image = new Image()
    image.src = props.imageUrl as string
    image.onload = () => {
      setLoaded(true)
    }
  }, [props.imageUrl])

  const { wrapperProps = {} } = props
  const { className, ...restProps } = wrapperProps
  return (
    <div
      className={clsx(styles['avatar-wrap'], className)}
      ref={avatarRef}
      style={
        props.size
          ? { height: props.size + 'px', width: props.size + 'px' }
          : undefined
      }
      {...restProps}
    >
      {createElement(props.url ? 'a' : 'div', {
        style: { backgroundColor: loaded ? undefined : randomColor },
        className: styles['avatar'],

        ...(props.url
          ? {
              href: props.url,
              target: '_blank',
              rel: 'noreferrer',
            }
          : {}),

        children: (
          <div
            className={styles['image']}
            style={{
              backgroundImage: `url(${props.imageUrl})`,
              opacity: loaded ? 1 : 0,
            }}
          ></div>
        ),
      })}
    </div>
  )
})
