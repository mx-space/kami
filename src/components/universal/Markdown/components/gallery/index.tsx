import clsx from 'clsx'
import { throttle } from 'lodash-es'
import type { FC, UIEventHandler } from 'react'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { ImageLazy } from '~/components/universal/Image'
import { ImageSizeMetaContext } from '~/context'
import { calculateDimensions } from '~/utils/images'

import type { MImageType } from '../../utils/image'
import styles from './index.module.css'

interface GalleryProps {
  images: MImageType[]
}
const IMAGE_CONTAINER_MARGIN_INSET = 60
const CHILD_GAP = 15
export const Gallery: FC<GalleryProps> = (props) => {
  const { images } = props
  const imageMeta = useContext(ImageSizeMetaContext)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
  const containerWidth = useMemo(
    () => containerRef?.clientWidth || 0,
    [containerRef?.clientWidth],
  )

  const [updated, setUpdated] = useState({})
  const memoedChildContainerWidthRef = useRef(0)

  useEffect(() => {
    if (!containerRef) {
      return
    }

    const ob = new ResizeObserver(() => {
      setUpdated({})
      calChild(containerRef)
    })
    function calChild(containerRef: HTMLDivElement) {
      const $child = containerRef.children.item(0)
      if ($child) {
        memoedChildContainerWidthRef.current = $child.clientWidth
      }
    }

    calChild(containerRef)

    ob.observe(containerRef)
    return () => {
      ob.disconnect()
    }
  }, [containerRef])

  const childStyle = useRef({
    width: `calc(100% - ${IMAGE_CONTAINER_MARGIN_INSET}px)`,
    marginRight: `${CHILD_GAP}px`,
  }).current

  const [currentIndex, setCurrentIndex] = useState(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOnScroll: UIEventHandler<HTMLDivElement> = useCallback(
    throttle((e) => {
      const $ = e.target as HTMLDivElement

      const index = Math.floor(
        ($.scrollLeft + IMAGE_CONTAINER_MARGIN_INSET + 15) /
          memoedChildContainerWidthRef.current,
      )
      setCurrentIndex(index)
    }, 60),
    [],
  )
  const handleScrollTo = useCallback(
    (i: number) => {
      if (!containerRef) {
        return
      }

      containerRef.scrollTo({
        left: memoedChildContainerWidthRef.current * i,
        behavior: 'smooth',
      })
    },
    [containerRef],
  )

  return (
    <div className={clsx('w-full', 'relative')}>
      <div
        className={clsx(
          'w-full whitespace-nowrap overflow-auto',
          styles['container'],
        )}
        ref={setContainerRef}
        onScroll={handleOnScroll}
      >
        {images.map((image) => {
          const info = imageMeta.get(image.url)
          const maxWidth = containerWidth - IMAGE_CONTAINER_MARGIN_INSET
          const { height, width } = calculateDimensions(
            info?.width || 0,
            info?.height || 0,
            {
              width: maxWidth,

              height: 600,
            },
          )
          const alt = image.name
          const title = image.footnote
          const imageCaption =
            title ||
            (['!', '¡'].some((ch) => ch == alt?.[0]) ? alt?.slice(1) : '') ||
            ''
          return (
            <div
              style={childStyle}
              className={clsx(styles['child'], 'inline-block')}
              key={`${image.url}-${image.name || ''}`}
            >
              <ImageLazy
                popup
                backgroundColor={info?.accent}
                getParentElWidth={maxWidth}
                src={image.url}
                alt={imageCaption}
                height={height || 350}
                width={width || maxWidth}
              />
            </div>
          )
        })}
      </div>

      <div className={clsx(styles['indicator'], 'space-x-2')}>
        {Array.from({
          length: images.length,
        }).map((_, i) => {
          return (
            <div
              className={clsx(
                'h-[6px] w-[6px] rounded-full bg-light-font opacity-50 transition-opacity duration-200 ease-in-out cursor-pointer',
                currentIndex == i && '!opacity-100',
              )}
              key={i}
              onClick={handleScrollTo.bind(null, i)}
            />
          )
        })}
      </div>
    </div>
  )
}
