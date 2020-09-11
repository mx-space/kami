import classNames from 'classnames'
import dynamic from 'next/dynamic'
import randomColor from 'randomcolor'
import {
  ClassAttributes,
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
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
  popup?: boolean
}

const Image: FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
    placeholderRef: any
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
            <Zoom overlayBgColorEnd={'var(--light-bg)'}>
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
    <div style={{ ...(style || {}), display: 'inline-block' }}>
      {defaultImage ? (
        <img src={defaultImage} alt={alt} {...rest} ref={realImageRef} />
      ) : (
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            // overflow: 'hidden',
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
              backgroundColor: useRandomBackgroundColor ? randColor : '',
              filter:
                useRandomBackgroundColor && colorMode === 'dark'
                  ? 'brightness(0.5)'
                  : 'brightness(1.3)',
              zIndex: -1,
            }}
          ></div>
        </div>
      )}
      {alt && alt.startsWith('!') && (
        <p className={'img-alt'}>{alt.slice(1)}</p>
      )}
    </div>
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
