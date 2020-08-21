import rc from 'randomcolor'
import {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from './index.module.scss'
interface AvatarProps {
  url?: string
  imageUrl: string
  size?: number
}

export const Avatar: FC<
  AvatarProps &
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = memo((props) => {
  // const { url, imageUrl, size, ...rest } = props
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
  return (
    <div
      className={styles['avatar-wrap']}
      ref={avatarRef}
      style={
        props.size
          ? { height: props.size + 'px', width: props.size + 'px' }
          : undefined
      }
    >
      <a
        style={{
          backgroundColor: loaded ? undefined : randomColor,
        }}
        className={styles['avatar']}
        href={props.url ?? 'javascript:;'}
        target={!props.url ? undefined : '_blank'}
      >
        <div
          className={styles['image']}
          style={{
            backgroundImage: `url(${props.imageUrl})`,
            opacity: loaded ? 1 : 0,
          }}
        ></div>
      </a>
    </div>
  )
})
