import { sanitizeUrl } from 'markdown-to-jsx'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useContext, useEffect, useRef, useState } from 'react'

import type { ImageLazyRef } from '~/components/universal/Image'
import { ImageLazy } from '~/components/universal/Image'
import { useIsClient } from '~/hooks/use-is-client'
import { useStore } from '~/store'
import { calculateDimensions } from '~/utils/images'

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
  const imageRef = useRef<ImageLazyRef>(null)
  useEffect(() => {
    const disposer = reaction(
      () => appUIStore.viewport.w | appUIStore.viewport.h,
      () => {
        if (imageRef.current?.status === 'loaded') {
          disposer()

          return
        }
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
})
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
