import { ImageLazyWithPopup } from 'components/universal/Image'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { FC, useContext, useEffect, useState } from 'react'
import { useStore } from 'store'
import { calculateDimensions } from 'utils/images'
import { ImageSizeMetaContext } from '../../../../context/image-size'

const getContainerSize = () => {
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
  const { appUIStore } = useStore()
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

    height: Infinity,
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
      style={style}
      data-raw-height={height}
      data-raw-width={width}
      overflowHidden
    />
  )
})
const style = { padding: '1rem 0' }
export const Image =
  typeof document === 'undefined'
    ? ({ src, alt }) => <img src={src} alt={alt} />
    : _Image
