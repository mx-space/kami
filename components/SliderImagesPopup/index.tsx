import React, { FC, memo } from 'react'
import Zoom from 'react-medium-image-zoom'

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
          <Zoom key={i} overlayBgColorEnd={'var(--light-bg)'} zoomMargin={50}>
            <img src={image.src} />
          </Zoom>
        )
      })}
    </>
  )
})
