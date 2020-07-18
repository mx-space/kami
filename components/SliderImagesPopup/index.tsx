import dynamic from 'next/dynamic'
import { FC, memo } from 'react'
const Zmage = dynamic(() => import('react-zmage'), { ssr: false })
interface SliderImagesPopupProps {
  images: { src: string; alt: string; className?: string }[]
}

export const SliderImagesPopup: FC<SliderImagesPopupProps> = memo((props) => {
  const { images } = props
  return (
    <>
      {images.map((image, i) => {
        const set = images.slice(i, images.length).concat(images.slice(0, i))
        return (
          <Zmage key={image.src} set={set} src={image.src} alt={image.alt} />
        )
      })}
    </>
  )
})
