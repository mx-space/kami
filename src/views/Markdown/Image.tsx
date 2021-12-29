import { appUIStore } from 'common/store'
import { ImageLazyWithPopup } from 'components/Image'
import { reaction } from 'mobx'
import dynamic from 'next/dynamic'
import React, { FC, useContext, useEffect, useState } from 'react'
import { observer } from 'utils/mobx'
import { ImageSizeMetaContext } from '../../common/context/ImageSizes'

const calculateDimensions = (
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
const getContainerSize = () => {
  // const $wrap = document.getElementById('article-wrap')
  // if (!$wrap) {
  //   return
  // }
  // return (
  //   $wrap.getBoundingClientRect().width -
  //   // padding 2em left and right 2 * 2
  //   parseFloat(getComputedStyle(document.body).fontSize) * 2 * 2
  // )
  const $wrap = document.getElementById('write')
  if (!$wrap) {
    return
  }

  return $wrap.getBoundingClientRect().width
}

/**
 * This Component only can render in browser.
 */
const _Image: FC<{ src: string; alt?: string }> = observer(({ src, alt }) => {
  useEffect(() => {
    const disposer = reaction(
      () => appUIStore.viewport.w | appUIStore.viewport.h,
      () => {
        setMaxWidth(getContainerSize())
      },
    )

    return () => {
      disposer()
    }
  }, [])
  const images = useContext(ImageSizeMetaContext)

  const isPrintMode = appUIStore.mediaType === 'print'

  const [maxWidth, setMaxWidth] = useState(getContainerSize())

  // 因为有动画开始不能获取到大小 , 直到获取到 container 的大小
  useEffect(() => {
    let raf = requestAnimationFrame(function a() {
      const size = getContainerSize()
      if (!size) {
        requestAnimationFrame(a)
      } else {
        setMaxWidth(size)
      }
    }) as any
    return () => {
      raf = cancelAnimationFrame(raf)
    }
  }, [])

  if (isPrintMode) {
    return <img src={src} alt={alt}></img>
  }

  const { accent, height, width } = images.get(src) || {
    height: undefined,
    width: undefined,
  }

  const max = {
    width: maxWidth ?? 500,

    height: window.innerHeight * 0.8,
  }

  let cal = {} as any
  if (width && height) {
    cal = calculateDimensions(width, height, max)
  }

  return (
    <ImageLazyWithPopup
      src={src}
      alt={alt}
      backgroundColor={accent}
      height={cal.height}
      width={cal.width}
      style={{ padding: '1rem 0' }}
      data-raw-height={height}
      data-raw-width={width}
      overflowHidden
    />
  )
})
export const Image =
  typeof document === 'undefined'
    ? ({ src, alt }) => <img src={src} alt={alt} />
    : dynamic(() => Promise.resolve(_Image), { ssr: false })
