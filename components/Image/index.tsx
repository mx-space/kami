import classNames from 'classnames'
import { observer } from 'mobx-react'
import dynamic from 'next/dynamic'
import randomColor from 'randomcolor'
import {
  ClassAttributes,
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import type { LazyImage as LazyImageProps } from 'react-lazy-images'
import { useStore } from '../../common/store'
import { isClientSide } from '../../utils'

const Zmage = dynamic(() => import('react-zmage'), { ssr: false })
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
    wrapRef: any
    popup?: boolean
  }
> = memo(({ src, alt, placeholderRef, wrapRef, popup = false }) => {
  const [loaded, setLoad] = useState(false)
  const fakeImageRef = useRef<HTMLImageElement>(null)
  const onLoad = useCallback(() => {
    setLoad(true)
    try {
      if (fakeImageRef && fakeImageRef.current) {
        fakeImageRef.current.remove()
      }
      if (placeholderRef && placeholderRef.current) {
        placeholderRef.current.classList.add('hide')
      }
      if (wrapRef && wrapRef.current) {
        wrapRef.current.style.height = ''
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }, [placeholderRef, wrapRef])
  return (
    <>
      <div className={classNames('lazyload-image', !loaded && 'image-hide')}>
        {popup ? (
          <Zmage src={src} alt={alt} backdrop={'var(--light-bg)'} />
        ) : (
          <img src={src} alt={alt} />
        )}
      </div>

      <img
        src={src}
        onLoad={onLoad}
        style={{ position: 'absolute', opacity: 0, zIndex: -99 }}
        ref={fakeImageRef}
        alt={alt}
      />
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
    height = 300,
    width,
    useRandomBackgroundColor,
    popup = false,
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
    <>
      {defaultImage ? (
        <img src={defaultImage} alt={alt} {...rest} ref={realImageRef} />
      ) : (
        <div
          style={{
            position: 'relative',
            // overflow: 'hidden',
            height,
            width,
            maxWidth: '100%',
            margin: 'auto',
          }}
          ref={wrapRef}
        >
          {/* <LazyLoad once debounce={500}>
            <Image
              className={'image-hide lazyload-image'}
              {...rest}
              src={src}
              alt={alt}
              {...{ placeholderRef, wrapRef }}
            />
          </LazyLoad> */}
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
                  {...{ placeholderRef, wrapRef }}
                  {...props}
                />
              )
            }}
            observerProps={
              isClientSide()
                ? {
                    rootMargin: '100px',
                    threshold: 0.3,
                  }
                : undefined
            }
          />

          <div
            className="placeholder-image"
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
    </>
  )
})

export const ImageLazyWithPopup: FC<
  { src: string; alt?: string } & Partial<
    ImageFCProps &
      ClassAttributes<HTMLImageElement> &
      ImgHTMLAttributes<HTMLImageElement>
  >
> = (props) => {
  return (
    <ImageLazy
      src={props.src}
      alt={props.alt || props.src}
      height={props.height}
      width={props.width}
      useRandomBackgroundColor
      popup
    ></ImageLazy>
  )
}
