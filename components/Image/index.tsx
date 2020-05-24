import LoadImage from 'assets/images/load.gif'
import { observer } from 'mobx-react'
import dynamic from 'next/dynamic'
import randomColor from 'randomcolor'
import {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  memo,
  MouseEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import Lightbox, { ILightBoxProps } from 'react-image-lightbox'
import { LazyImageProps } from 'react-lazy-images'
import LazyLoad from 'react-lazyload'
import { useStore } from '../../store'
const LazyImage = dynamic(
  () => import('react-lazy-images').then((mo) => mo.LazyImage as any),
  { ssr: false },
) as React.StatelessComponent<LazyImageProps>
interface ImageFCProps {
  defaultImage?: string
  src: string
  alt?: string
  height?: number
  width?: number
  useRandomBackgroundColor?: boolean
}

export const Image: FC<
  ImageFCProps &
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = observer((props) => {
  const {
    defaultImage,
    src,
    alt = src,
    height,
    width,
    useRandomBackgroundColor,
    ...rest
  } = props

  const realImageRef = useRef<HTMLImageElement>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)
  const fakeImageRef = useRef<HTMLImageElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const onError = () => {}
  const onLoad = useCallback(() => {
    realImageRef.current!.src = src
    realImageRef.current!.classList.remove('image-hide')
    try {
      if (fakeImageRef && fakeImageRef.current) {
        fakeImageRef.current.remove()
      }
      if (placeholderRef && placeholderRef.current) {
        placeholderRef.current.classList.add('hide')
        setTimeout(() => {
          placeholderRef.current!.remove()
        }, 600)
      }
      if (wrapRef && wrapRef.current) {
        wrapRef.current.style.height = ''
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }, [src])
  const colorMode = useStore().appStore.colorMode
  const [randColor, setRandColor] = useState(
    randomColor({ luminosity: colorMode === 'light' ? 'bright' : 'dark' }),
  )
  useEffect(() => {
    setRandColor(
      randomColor({ luminosity: colorMode === 'light' ? 'light' : 'dark' }),
    )
  }, [colorMode])

  return (
    <LazyLoad
      once
      placeholder={
        <div
          className="placeholder-image"
          style={{
            backgroundColor: useRandomBackgroundColor ? randColor : '',
          }}
        ></div>
      }
    >
      {defaultImage ? (
        <img src={defaultImage} alt={alt} {...rest} ref={realImageRef} />
      ) : (
        <div
          style={{
            position: 'relative',
            // overflow: 'hidden',
            height: height,
          }}
          ref={wrapRef}
        >
          <img
            ref={realImageRef}
            className={'image-hide'}
            {...rest}
            alt={alt}
          />
          <div
            className="placeholder-image"
            ref={placeholderRef}
            style={{
              height,
              width,
              position: 'absolute',
              backgroundColor: useRandomBackgroundColor ? randColor : '',
              filter:
                useRandomBackgroundColor && colorMode === 'dark'
                  ? 'brightness(0.5)'
                  : undefined,
            }}
          ></div>
        </div>
      )}
      <img
        src={src}
        onError={onError}
        onLoad={onLoad}
        style={{ position: 'absolute', opacity: 0, zIndex: -99 }}
        ref={fakeImageRef}
        alt={alt}
      />
    </LazyLoad>
  )
})
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
        alt={props.alt || props.src}
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
            alt={props.alt || props.src}
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
      <Image
        src={props.src}
        alt={props.alt || props.src}
        height={300}
        onClick={() => {
          setOpen(true)
        }}
        style={{ cursor: 'pointer' }}
        useRandomBackgroundColor
      ></Image>
      {isOpen && (
        <Lightbox mainSrc={props.src} onCloseRequest={() => setOpen(false)} />
      )}
    </>
  )
})
