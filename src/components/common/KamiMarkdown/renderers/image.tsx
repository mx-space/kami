import { sanitizeUrl } from 'markdown-to-jsx'
import type { FC } from 'react'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { useAppStore } from '~/atoms/app'
import type { ImageLazyRef } from '~/components/ui/Image'
import { ImageLazy } from '~/components/ui/Image'
import { ImageSizeMetaContext } from '~/components/ui/Image/context'
import { calculateDimensions } from '~/components/ui/Image/utils/calc-image'
import { useIsClient } from '~/hooks/common/use-is-client'

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
const _Image: FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const imageRef = useRef<ImageLazyRef>(null)
  useEffect(() => {
    let prevViewport = {} as any

    const disposer = useAppStore.subscribe((state) => {
      const { viewport } = state
      if (prevViewport.w === viewport.w && prevViewport.h === viewport.h) {
        return
      }
      prevViewport = viewport
      if (imageRef.current?.status === 'loaded') {
        disposer()
        return
      }
      setMaxWidth(getContainerSize())
    })

    return disposer
  }, [])
  const images = useContext(ImageSizeMetaContext)

  const isPrintMode = useAppStore((state) => state.mediaType === 'print')

  const [maxWidth, setMaxWidth] = useState(getContainerSize())

  // 因为有动画开始不能获取到大小 , 直到获取到 container 的大小
  useEffect(() => {
    let raf = requestAnimationFrame(function $() {
      const size = getContainerSize()
      if (!size) {
        requestAnimationFrame($)
      } else {
        setMaxWidth(size)
      }
    }) as any
    return () => {
      raf = cancelAnimationFrame(raf)
    }
  }, [])

  if (isPrintMode) {
    return <img src={src} alt={alt} />
  }

  const { accent, height, width } = images.get(src) || {
    height: undefined,
    width: undefined,
  }

  const max = {
    width: maxWidth ?? 644,
    height: Infinity,
  }

  let cal = {} as any
  if (width && height) {
    cal = calculateDimensions(width, height, max)
  }

  return (
    <ImageLazy
      showErrorMessage
      popup
      ref={imageRef}
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
}
const style = { padding: '1rem 0' }
export const MImage: FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = (props) => {
  const { src, alt, title } = props
  const sanitizedUrl = sanitizeUrl(src!)
  const isClient = useIsClient()
  const imageCaption =
    title ||
    (['!', '¡'].some((ch) => ch == alt?.[0]) ? alt?.slice(1) : '') ||
    ''

  return !isClient ? (
    <img src={sanitizedUrl!} alt={imageCaption} title={title} />
  ) : (
    <_Image src={sanitizedUrl!} alt={imageCaption} />
  )
}
