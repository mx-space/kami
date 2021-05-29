/*
 * @Author: Innei
 * @Date: 2020-12-28 23:08:46
 * @LastEditTime: 2021-05-29 18:09:51
 * @LastEditors: Innei
 * @FilePath: /web/utils/images.ts
 * Mark: Coding with Love
 */
import { sample, shuffle } from 'lodash'
import { ImageSizeRecord } from 'models/base'

export const imagesRecord2Map = (images: ImageSizeRecord[]) => {
  const map = new Map<string, ImageSizeRecord>()
  images.forEach((image) => {
    map.set(image.src, image)
  })
  return map
}

type GiteeRepoApiPayload = {
  sha: string
  tree: {
    path: string
    mode: string
    type: string
    sha: string
    size: number
    url: string
  }[]
  truncated: string
  url: string
}
export const fetchOnlineRandomImages = async () => {
  const { tree } = (await (
    await fetch(
      'https://gitee.com/api/v5/repos/xun7788/my-imagination/git/trees/master',
    )
  ).json()) as GiteeRepoApiPayload
  try {
    const { url } = tree.find((t) => t.path == 'images' && t.type == 'tree')!
    const onlineImagePayload = (await (
      await fetch(url)
    ).json()) as GiteeRepoApiPayload
    onlineImagePayload.tree.forEach((i) => {
      if (i.type == 'blob') {
        animeImages.push(i.url)
      }
    })
    // eslint-disable-next-line no-empty
  } catch {}
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
].map((i) => 'https://gitee.com/xun7788/my-imagination/raw/master/images/' + i)
export const getAnimationImages = () => {
  return [...animeImages]
}
export const getRandomImage = (count?: number) => {
  return shuffle(animeImages).slice(0, count)
}
