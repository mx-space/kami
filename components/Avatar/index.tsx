import { DetailedHTMLProps, FC, ImgHTMLAttributes, memo } from 'react'
import { ImageLazy } from '../Image'
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
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          -webkit-transform: translate3d(0, 0, 0);
          -moz-transform: translate3d(0, 0, 0);
        }
      `}</style>
      <a
        href={props.url ?? 'javascript:;'}
        target={!props.url ? undefined : '_blank'}
      >
        <ImageLazy
          src={props.imageUrl}
          height={'100%'}
          width={'100%'}
          useRandomBackgroundColor
        />
      </a>
    </div>
  )
})
