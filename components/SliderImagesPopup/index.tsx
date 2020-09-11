import { ImageLazyWithPopup } from 'components/Image'
import { FC, memo } from 'react'

interface SliderImagesPopupProps {
  images: { src: string; alt: string; className?: string }[]
}

export const SliderImagesPopup: FC<SliderImagesPopupProps> = memo((props) => {
  const { images } = props
  return (
    <>
      {images.map((image, i) => {
        // const set = images.slice(i, images.length).concat(images.slice(0, i))
        return (
          // <Zmage key={image.src} set={set} src={image.src} alt={image.alt} />
          <ImageLazyWithPopup src={image.src} key={i} />
        )
      })}
    </>
  )
})
