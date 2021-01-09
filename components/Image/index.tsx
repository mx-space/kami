import classNames from 'classnames'
import dynamic from 'next/dynamic'
import randomColor from 'randomcolor'
import {
  ClassAttributes,
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { LazyImage as LazyImageProps } from 'react-lazy-images'
import { observer } from 'utils/mobx'
import { useStore } from '../../common/store'
import { isClientSide } from '../../utils'
import Zoom from 'react-medium-image-zoom'

const LazyImage = (dynamic(() =>
  import('react-lazy-images').then((mo: any) => mo.LazyImage),
) as any) as typeof LazyImageProps
interface ImageFCProps {
  defaultImage?: string
  src: string
  alt?: string
  height?: number | string
  width?: number | string
  useRandomBackgroundColor?: boolean
  backgroundColor?: string
  popup?: boolean
}

const Image: FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
    placeholderRef: RefObject<HTMLDivElement>
    popup?: boolean
  }
> = observer(({ src, alt, placeholderRef, popup = false }) => {
  const [loaded, setLoad] = useState(false)
  const { appStore } = useStore()
  const isMobile = appStore.viewport.mobile
  useEffect(() => {
    if (src) {
      const image = new window.Image()
      image.src = src as string
      image.onload = () => {
        setLoad(true)
        try {
          if (placeholderRef && placeholderRef.current) {
            placeholderRef.current.classList.add('hide')
          }
          // if (wrapRef && wrapRef.current) {
          //   wrapRef.current.style.height = ''
          // }
          // eslint-disable-next-line no-empty
        } catch {}
      }
      image.onerror = () => {
        try {
          if (placeholderRef && placeholderRef.current) {
            placeholderRef.current.innerHTML = `
            <span style="color: currentColor; filter: invert(100%) brightness(1.5)">图片加载失败!</span>
            <a href="${image.src}" target="_blank">${image.src}
            </a>
            `
          }
          // eslint-disable-next-line no-empty
        } catch {}
      }
    }
  }, [placeholderRef, src])
  return (
    <>
      <div className={classNames('lazyload-image', !loaded && 'image-hide')}>
        {popup ? (
          isMobile ? (
            <img
              src={src}
              alt={alt}
              onClick={() => {
                window.open(src)
              }}
            />
          ) : (
            <Zoom overlayBgColorEnd={'var(--light-bg)'} zoomMargin={50}>
              <img src={src} alt={alt} />
            </Zoom>
          )
        ) : (
          <img src={src} alt={alt} />
        )}
      </div>
    </>
  )
})

export const ImageLazy: FC<
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
    backgroundColor,
    popup = false,
    style,
    ...rest
  } = props

  const realImageRef = useRef<HTMLImageElement>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)

  const wrapRef = useRef<HTMLDivElement>(null)

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
    <figure style={{ ...(style || {}) }}>
      {defaultImage ? (
        <img src={defaultImage} alt={alt} {...rest} ref={realImageRef} />
      ) : (
        <div
          style={{
            position: 'relative',
            transition: 'height .3s, width .3s',
            height,
            width,
            maxWidth: '100%',
            margin: 'auto',
          }}
          ref={wrapRef}
        >
          <LazyImage
            src={src}
            alt={alt}
            loadEagerly={!isClientSide()}
            placeholder={({ ref }) => <div ref={ref} />}
            actual={(props) => {
              return (
                <Image
                  className={'image-hide lazyload-image'}
                  {...rest}
                  src={src}
                  alt={alt}
                  popup={popup}
                  {...{ placeholderRef }}
                  {...props}
                />
              )
            }}
            observerProps={
              isClientSide()
                ? {
                    rootMargin: '100px',
                  }
                : undefined
            }
          />

          <div
            className={classNames('placeholder-image', props.className)}
            ref={placeholderRef}
            style={{
              height,
              width,
              maxWidth: '100%',
              position: 'absolute',
              color:
                backgroundColor ?? (useRandomBackgroundColor ? randColor : ''),
              backgroundColor: 'currentColor',
              filter: backgroundColor
                ? colorMode === 'dark'
                  ? 'brightness(0.8)'
                  : undefined
                : useRandomBackgroundColor && colorMode === 'dark'
                ? 'brightness(0.5)'
                : 'brightness(1.3)',
              zIndex: -1,
            }}
          ></div>
        </div>
      )}
      {alt && (alt.startsWith('!') || alt.startsWith('¡')) && (
        <figcaption className={'img-alt'}>{alt.slice(1)}</figcaption>
      )}
    </figure>
  )
})

export const ImageLazyWithPopup: FC<
  { src: string; alt?: string } & Partial<
    ImageFCProps &
      ClassAttributes<HTMLImageElement> &
      ImgHTMLAttributes<HTMLImageElement>
  >
> = (props) => {
  const { src, alt, height, width, ...rest } = props
  return (
    <ImageLazy
      src={src}
      alt={alt || src}
      height={height}
      width={width}
      useRandomBackgroundColor
      popup
      {...rest}
    ></ImageLazy>
  )
}
