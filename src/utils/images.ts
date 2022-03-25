import { Image } from '@mx-space/api-client'
import shuffle from 'lodash-es/shuffle'

export const imagesRecord2Map = (images: Image[]) => {
  const map = new Map<string, Image>()
  images.forEach((image) => {
    map.set(image.src, image)
  })
  return map
}

const animeImages = [
  'qsNmnC2zHB5FW41.jpg',
  'GwJzq4SYtClRcZh.jpg',
  '6nOYcygRGXvpsFd.jpg',
  'Qr2ykmsEFpJn4BC.jpg',
  'KiOuTlCzge7JHh3.jpg',
  'sM2XCJTW8BdUe5i.jpg',
  '18KQYP9fNGbrzJu.jpg',
  'rdjZo6Sg2JReyiA.jpg',
  'X2MVRDe1tyJil3O.jpg',
  'EDoKvz5p7BXZ46U.jpg',
  'EGk4qUvcXDygV2z.jpg',
  '5QdwFC82gT3XPSZ.jpg',
  'KPyTCARHBzpxJ46.jpg',
  '7TOEIPwGrZB1qFb.jpg',
  'Ihj5QAZgVMqr9fJ.jpg',
  'KZ6jv8C92Vpwcih.jpg',
].map((i) => `/assets/images/${i}`)

export const getRandomImage = (count?: number) => {
  return shuffle(animeImages).slice(0, count)
}

export const calculateDimensions = (
  width: number,
  height: number,
  max: { width: number; height: number },
) => {
  const { height: maxHeight, width: maxWidth } = max
  const wRatio = maxWidth / width
  const hRatio = maxHeight / height
  let ratio = 1
  if (maxWidth == Infinity && maxHeight == Infinity) {
    ratio = 1
  } else if (maxWidth == Infinity) {
    if (hRatio < 1) ratio = hRatio
  } else if (maxHeight == Infinity) {
    if (wRatio < 1) ratio = wRatio
  } else if (wRatio < 1 || hRatio < 1) {
    ratio = wRatio <= hRatio ? wRatio : hRatio
  }
  if (ratio < 1) {
    return {
      width: width * ratio,
      height: height * ratio,
    }
  }
  return {
    width,
    height,
  }
}
