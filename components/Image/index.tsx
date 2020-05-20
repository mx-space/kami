import LoadImage from 'assets/images/load.gif'
import dynamic from 'next/dynamic'
import {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  MouseEvent,
  useRef,
  useState,
  memo,
} from 'react'
import Lightbox, { ILightBoxProps } from 'react-image-lightbox'
import { /* LazyImage ,*/ LazyImageProps } from 'react-lazy-images'
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

export const ImageLazy: FC<
  {
    src: string
    alt?: string
    onClick?: (e?: MouseEvent<HTMLImageElement>) => void
  } & Partial<LazyImageProps>
> = (props) => {
  return (
    <>
      <style jsx>{`
        .placeholder.bg {
          height: 300px;
          width: 100px;
          background: #ccc;
          opacity: 0.6;
        }
        .load-error {
          height: 300px;
          width: 100%;
          background: #bbb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          border-radius: 12px;
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
          return (
            <img src={LoadImage} alt={'loading'} style={{ height: '300px' }} />
          )
        }}
        error={() => (
          <div className="load-error">
            <p>图片加载失败了~ 真是抱歉</p>
          </div>
        )}
        actual={({ imageProps }) => (
          <img
            {...imageProps}
            style={{
              animation: 'fade-in 1s both',
              cursor: props.onClick ? 'pointer' : '',
            }}
            onClick={props.onClick}
          />
        )}
      />
    </>
  )
}

export const ImageLazyWithPopup: FC<
  { src: string; alt?: string } & ILightBoxProps
> = memo((props) => {
  const [isOpen, setOpen] = useState(false)
  return (
    <>
      <ImageLazy
        {...{ src: props.src, alt: props.alt }}
        onClick={() => {
          setOpen(true)
        }}
      />
      {isOpen && (
        <Lightbox mainSrc={props.src} onCloseRequest={() => setOpen(false)} />
      )}
    </>
  )
})
