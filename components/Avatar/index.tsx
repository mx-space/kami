import defaultAvatar from 'assets/images/default-avatar.png'
import { DetailedHTMLProps, FC, ImgHTMLAttributes, useRef } from 'react'
interface AvatarProps {
  url?: string
  imageUrl: string
  size?: number
}

export const Avatar: FC<
  AvatarProps &
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = (props) => {
  const { url, imageUrl, size, ...rest } = props
  const imageRef = useRef<HTMLImageElement>(null)
  return (
    <div
      className="avatar"
      style={
        props.size
          ? { height: props.size + 'px', width: props.size + 'px' }
          : undefined
      }
    >
      <style jsx>{`
        .avatar {
          width: 80px;
          height: 80px;
          box-sizing: border-box;
          border: 3px #bbb solid;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 1px 2px 9px 0px rgba(0, 0, 0, 0.32);
        }
        img {
          width: 100%;
          height: auto;
        }
      `}</style>
      <a
        href={props.url ?? 'javascript:;'}
        target={!props.url ? undefined : '_blank'}
      >
        <img
          src={props.imageUrl}
          ref={imageRef}
          {...rest}
          onError={(_) => {
            imageRef.current && (imageRef.current.src = defaultAvatar)
          }}
        />
      </a>
    </div>
  )
}
