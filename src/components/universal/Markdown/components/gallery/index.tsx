import clsx from 'clsx'
import type { FC } from 'react'
import { useContext, useMemo, useRef, useState } from 'react'

import { ImageLazy } from '~/components/universal/Image'
import { ImageSizeMetaContext } from '~/context'
import { calculateDimensions } from '~/utils/images'

import type { MImageType } from '../../utils/image'
import styles from './index.module.css'

interface GalleryProps {
  images: MImageType[]
}
const IMAGE_CONTAINER_MARGIN_INSET = 60
export const Gallery: FC<GalleryProps> = (props) => {
  const { images } = props
  const imageMeta = useContext(ImageSizeMetaContext)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
  const containerWidth = useMemo(
    () => containerRef?.clientWidth || 0,
    [containerRef?.clientWidth],
  )
  const childStyle = useRef({
    width: `calc(100% - ${IMAGE_CONTAINER_MARGIN_INSET}px)`,
  }).current
  return (
    <div
      className={clsx(
        'w-full whitespace-nowrap overflow-auto',
        styles['container'],
      )}
      ref={setContainerRef}
    >
      {images.map((image) => {
        const info = imageMeta.get(image.url)
        const maxWidth = containerWidth - 60
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
              getParentElWidth={() => maxWidth}
              src={image.url}
              alt={imageCaption}
              height={height}
              width={width}
            />
          </div>
        )
      })}
    </div>
  )
}
