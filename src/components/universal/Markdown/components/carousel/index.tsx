import type { FC } from 'react'

import { ImageLazy } from '~/components/universal/Image'

import type { MImageType } from '../../utils/image'

interface CarouselProps {
  images: MImageType[]
}
export const Carousel: FC<CarouselProps> = (props) => {
  const { images } = props
  return (
    <div className="w-full whitespace-nowrap">
      {images.map((image) => {
        return (
          <ImageLazy
            src={image.url}
            alt={image.name || image.footnote || ''}
            key={`${image.url}-${image.name || ''}`}
          />
        )
      })}
    </div>
  )
}
