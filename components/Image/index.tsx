import { FC, DetailedHTMLProps, ImgHTMLAttributes, useRef } from 'react'

interface ImageFCProps {
  defaultImage: string
  src: string
  alt: string
}

export const Image: FC<
  ImageFCProps &
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = (props) => {
  const { defaultImage, src, alt, ...rest } = props

  const realImageRef = useRef<HTMLImageElement>(null)
  const onError = () => {}
  const onLoad = () => {
    realImageRef.current!.src = src
  }
  return (
    <>
      <img src={defaultImage} alt={alt} {...rest} ref={realImageRef} />
      <img
        src={src}
        onError={onError}
        onLoad={onLoad}
        style={{ position: 'absolute', opacity: 0, zIndex: -99 }}
      />
    </>
  )
}
