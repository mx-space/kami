import { FC, DetailedHTMLProps, ImgHTMLAttributes, useRef } from 'react'
import { /* LazyImage ,*/ LazyImageProps } from 'react-lazy-images'
import LoadImage from 'assets/images/load.gif'
import 'intersection-observer'
import dynamic from 'next/dynamic'
const LazyImage = dynamic(
  () => import('react-lazy-images').then((mo) => mo.LazyImage as any),
  { ssr: false },
) as React.StatelessComponent<LazyImageProps>
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

export const ImageLazy: FC<{ src: string; alt?: string } & LazyImageProps> = (
  props,
) => {
  return (
    <>
      <style jsx>{`
        .placeholder.bg {
          height: 300px;
          width: 100px;
          background: #ccc;
          opacity: 0.6;
        }
      `}</style>
      <LazyImage
        src={props.src}
        alt={props.alt}
        observerProps={{
          rootMargin: '100px',
          threshold: 0.3,
        }}
        debounceDurationMs={1000}
        // loadEagerly
        placeholder={({ imageProps, ref }) => (
          <div className={'placeholder bg'} ref={ref} />
        )}
        loading={() => {
          console.log('loading')
          return <img src={LoadImage} alt={'loading'} />
        }}
        error={() => (
          <>
            <img src={LoadImage} alt="error" />
            <p>There was an error fetching this image :(</p>
          </>
        )}
        actual={({ imageProps }) => (
          <img
            {...imageProps}
            style={{ animation: 'fade-small-large 1s both' }}
          />
        )}
      />
    </>
  )
}
