import { clsx } from 'clsx'
import mediumZoom from 'medium-zoom'
import type {
  CSSProperties,
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
} from 'react'
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { isDarkColorHex } from '~/utils/color'
import { escapeHTMLTag } from '~/utils/utils'

import { LazyLoad } from '../Lazyload'
import styles from './index.module.css'
import { useCalculateSize } from './use-calculate-size'

interface ImageProps {
  defaultImage?: string
  src: string
  alt?: string
  height?: number | string
  width?: number | string
  backgroundColor?: string
  popup?: boolean
  overflowHidden?: boolean
  getParentElWidth?: ((parentElementWidth: number) => number) | number
}

const Image: FC<
  {
    popup?: boolean

    loaderFn: () => void
    loaded: boolean
  } & Pick<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src' | 'alt'
  >
> = memo(({ src, alt, popup = false, loaded, loaderFn }) => {
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!popup) {
      return
    }
    const $image = imageRef.current
    if ($image) {
      const zoom = mediumZoom($image, {
        background: 'var(--light-bg)',
      })

      return () => {
        zoom.detach(zoom.getImages())
      }
    }
  }, [popup])

  useEffect(() => {
    loaderFn()
  }, [loaderFn])

  return (
    <>
      <div
        className={clsx(
          styles['lazyload-image'],
          !loaded && styles['image-hide'],
        )}
        data-status={loaded ? 'loaded' : 'loading'}
      >
        <img src={src} alt={alt} ref={imageRef} loading="lazy" />
      </div>
    </>
  )
})

export type ImageLazyRef = { status: 'loading' | 'loaded' }

export const ImageLazy = memo(
  forwardRef<
    ImageLazyRef,
    ImageProps &
      DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
  >((props, ref) => {
    const {
      defaultImage,
      src,
      alt,
      height,
      width,
      backgroundColor = 'rgb(111,111,111)',
      popup = false,
      style,
      overflowHidden = false,
      getParentElWidth = (w) => w,
      ...rest
    } = props
    useImperativeHandle(ref, () => {
      return {
        status: loaded ? 'loaded' : ('loading' as any),
      }
    })
    const realImageRef = useRef<HTMLImageElement>(null)
    const placeholderRef = useRef<HTMLDivElement>(null)

    const wrapRef = useRef<HTMLDivElement>(null)
    const [calculatedSize, calculateDimensions] = useCalculateSize()

    const [loaded, setLoad] = useState(false)
    const loaderFn = useCallback(() => {
      if (!src || loaded) {
        return
      }

      const image = new window.Image()
      image.src = src as string
      // FIXME
      const parentElement = wrapRef.current?.parentElement?.parentElement

      if (!height && !width) {
        calculateDimensions(
          image,
          typeof getParentElWidth == 'function'
            ? getParentElWidth(
                parentElement
                  ? parseFloat(getComputedStyle(parentElement).width)
                  : 0,
              )
            : getParentElWidth,
        )
      }

      image.onload = () => {
        setLoad(true)
        try {
          if (placeholderRef && placeholderRef.current) {
            placeholderRef.current.classList.add('hide')
          }

          // eslint-disable-next-line no-empty
        } catch {}
      }
      image.onerror = () => {
        try {
          if (placeholderRef && placeholderRef.current) {
            placeholderRef.current.innerHTML = `<p style="color:${
              isDarkColorHex(backgroundColor) ? '#eee' : '#333'
            };z-index:2"><span>图片加载失败!</span><br/>
          <a style="margin: 0 12px;word-break:break-all;white-space:pre-wrap;display:inline-block;" href="${escapeHTMLTag(
            image.src,
          )}" target="_blank">${escapeHTMLTag(image.src)}</a></p>`
          }
          // eslint-disable-next-line no-empty
        } catch {}
      }
    }, [
      src,
      loaded,
      height,
      width,
      calculateDimensions,
      getParentElWidth,
      backgroundColor,
    ])
    const memoPlaceholderImage = useMemo(
      () => (
        <PlaceholderImage
          height={height}
          width={width}
          backgroundColor={backgroundColor}
          ref={placeholderRef}
        />
      ),
      [backgroundColor, height, width],
    )

    const imageWrapperStyle = useMemo<CSSProperties>(
      () => ({
        height: loaded ? undefined : height || calculatedSize.height,
        width: loaded ? undefined : width || calculatedSize.width,

        ...(overflowHidden ? { overflow: 'hidden', borderRadius: '3px' } : {}),
      }),
      [
        calculatedSize.height,
        calculatedSize.width,
        height,
        loaded,
        overflowHidden,
        width,
      ],
    )
    return (
      <figure style={style} className="inline-block">
        {defaultImage ? (
          <img src={defaultImage} alt={alt} {...rest} ref={realImageRef} />
        ) : (
          <div
            className={clsx(
              'transition-none relative max-w-full m-auto inline-block min-h-[1px]',
              rest.className,
            )}
            style={imageWrapperStyle}
            ref={wrapRef}
            data-info={JSON.stringify({ height, width, calculatedSize })}
          >
            <LazyLoad offset={100} placeholder={memoPlaceholderImage}>
              <Image
                src={src}
                alt={alt}
                popup={popup}
                loaded={loaded}
                loaderFn={loaderFn}
              />
              {!loaded && memoPlaceholderImage}
            </LazyLoad>
          </div>
        )}
        {alt && <figcaption className={styles['img-alt']}>{alt}</figcaption>}
      </figure>
    )
  }),
)

const PlaceholderImage = memo(
  forwardRef<
    HTMLDivElement,
    { ref: any; className?: string } & Partial<ImageProps>
  >((props, ref) => {
    const { backgroundColor, height, width } = props
    return (
      <div
        className={clsx(styles['placeholder-image'], props.className)}
        ref={ref}
        style={{
          height,
          width,
          color: backgroundColor,
        }}
      />
    )
  }),
)
