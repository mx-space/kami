import { ImageSizeRecord } from 'models/base'

export const imagesRecord2Map = (images: ImageSizeRecord[]) => {
  const map = new Map<string, ImageSizeRecord>()
  images.forEach((image) => {
    map.set(image.src, image)
  })
  return map
}
