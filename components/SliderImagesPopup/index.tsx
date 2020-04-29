import { FC } from 'react'
import Lightbox, { ILightBoxProps } from 'react-image-lightbox'

interface SliderImagesPopupProps {
  images: string[]
  photoIndex: number
  onMovePrevRequest: () => any
  onMoveNextRequest: () => any
  isOpen: boolean
  onCloseRequest: () => any
}

export const SliderImagesPopup: FC<
  SliderImagesPopupProps & Partial<ILightBoxProps>
> = (props) => {
  const {
    images,
    photoIndex,
    onMovePrevRequest,
    onMoveNextRequest,
    onCloseRequest,
    isOpen,
    ...rest
  } = props

  return isOpen ? (
    <Lightbox
      {...rest}
      mainSrc={images[photoIndex]}
      nextSrc={images[(photoIndex + 1) % images.length]}
      prevSrc={images[(photoIndex + images.length - 1) % images.length]}
      onCloseRequest={onCloseRequest}
      onMovePrevRequest={onMovePrevRequest}
      onMoveNextRequest={onMoveNextRequest}
    />
  ) : null
}
