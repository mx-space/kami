import clsx from 'clsx'
import mediumZoom from 'medium-zoom'
import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react'
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import LazyLoad from 'react-lazyload'

import { useCalculateSize } from '../../../hooks/use-calculate-size'
import { escapeHTMLTag } from '../../../utils'
import styles from './index.module.css'

interface ImageProps {
  defaultImage?: string
  src: string
  alt?: string
  height?: number | string
  width?: number | string
  backgroundColor?: string
  popup?: boolean
  overflowHidden?: boolean
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
      mediumZoom($image, {
        background: 'var(--light-bg)',
        margin: 50,
      })
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
      alt = src,
      height,
      width,
      backgroundColor,
      popup = false,
      style,
      overflowHidden = false,
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
      if (!src) {
        return
      }

      const image = new window.Image()
      image.src = src as string
      if (!height && !width && wrapRef.current?.parentElement?.parentElement) {
        calculateDimensions(
          wrapRef.current?.parentElement?.parentElement,
          image,
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
            placeholderRef.current.innerHTML = `<p style="color: currentColor; filter: invert(100%) brightness(1.5)"><span>图片加载失败!</span><br/>
          <a href="${escapeHTMLTag(image.src)}" target="_blank">${escapeHTMLTag(
              image.src,
            )}</a></p>`
            placeholderRef.current.style.zIndex = '2'
          }
          // eslint-disable-next-line no-empty
        } catch {}
      }
    }, [calculateDimensions, height, src, width])

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
            style={{
              height: loaded ? undefined : height || calculatedSize.height,
              width: loaded ? undefined : width || calculatedSize.width,

              ...(overflowHidden
                ? { overflow: 'hidden', borderRadius: '3px' }
                : {}),
            }}
            ref={wrapRef}
            data-info={JSON.stringify({ height, width, calculatedSize })}
          >
            <LazyLoad
              offset={300}
              once
              placeholder={
                <PlaceholderImage
                  height={height}
                  width={width}
                  backgroundColor={backgroundColor}
                />
              }
            >
              <Image
                src={src}
                alt={alt.replace(/^[!¡]/, '') || ''}
                popup={popup}
                loaded={loaded}
                loaderFn={loaderFn}
              />
              {!loaded && (
                <PlaceholderImage
                  height={height}
                  width={width}
                  backgroundColor={backgroundColor}
                />
              )}
            </LazyLoad>
          </div>
        )}
        {alt && (alt.startsWith('!') || alt.startsWith('¡')) && (
          <figcaption className={styles['img-alt']}>{alt.slice(1)}</figcaption>
        )}
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
      ></div>
    )
  }),
)
