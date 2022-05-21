import mediumZoom from 'medium-zoom'
import type { FC } from 'react'
import React, { memo, useEffect } from 'react'

interface SliderImagesPopupProps {
  images: { src: string; alt: string; className?: string }[]
}

export const SliderImagesPopup: FC<SliderImagesPopupProps> = memo((props) => {
  const { images } = props

  useEffect(() => {
    requestAnimationFrame(() => {
      mediumZoom('[data-image-zoom]', {
        background: 'var(--light-bg)',
        margin: 50,
      })
    })
  }, [])
  return (
    <>
      {images.map((image, i) => {
        return <img src={image.src} key={i} data-image-zoom />
      })}
    </>
  )
})
