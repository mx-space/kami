import { observer } from 'mobx-react'
import randomColor from 'randomcolor'
import {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  ClassAttributes,
} from 'react'
import Lightbox, { ILightBoxProps } from 'react-image-lightbox'
import LazyLoad from 'react-lazyload'
import { useStore } from '../../store'

interface ImageFCProps {
  defaultImage?: string
  src: string
  alt?: string
  height?: number
  width?: number
  useRandomBackgroundColor?: boolean
}

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
    ...rest
  } = props

  const realImageRef = useRef<HTMLImageElement>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)
  const fakeImageRef = useRef<HTMLImageElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const onError = () => {}
  const onLoad = useCallback(() => {
    try {
      realImageRef.current!.src = src

      realImageRef.current!.classList.remove('image-hide')
      // eslint-disable-next-line no-empty
    } catch {}
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
            zIndex: -1,
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
            className={'image-hide lazyload-image'}
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
                  : 'brightness(1.3)',
              zIndex: -1,
            }}
          ></div>
        </div>
      )}
      {alt && alt.startsWith('!') && (
        <p className={'img-alt'}>{alt.slice(1)}</p>
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

export const ImageLazyWithPopup: FC<
  { src: string; alt?: string } & Partial<ILightBoxProps> &
    Partial<
      ImageFCProps &
        ClassAttributes<HTMLImageElement> &
        ImgHTMLAttributes<HTMLImageElement>
    >
> = memo((props) => {
  const [isOpen, setOpen] = useState(false)
  return (
    <>
      <ImageLazy
        src={props.src}
        alt={props.alt || props.src}
        height={props.height || 300}
        width={props.width}
        onClick={() => {
          setOpen(true)
        }}
        style={{ cursor: 'pointer' }}
        useRandomBackgroundColor
      ></ImageLazy>
      {isOpen && (
        <Lightbox mainSrc={props.src} onCloseRequest={() => setOpen(false)} />
      )}
    </>
  )
})
