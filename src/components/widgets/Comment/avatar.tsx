import rc from 'randomcolor'
import type { FC } from 'react'
import { memo, useEffect, useMemo, useState } from 'react'

import { useAppStore } from '~/atoms/app'
import { LazyLoad } from '~/components/ui/Lazyload'

import styles from './index.module.css'

const generateColorFromMode = (
  mode: 'bright' | 'light' | 'dark' | 'random' | undefined,
  seed?: string,
) => {
  return rc({ luminosity: mode, alpha: 0.28, format: 'hex', seed })
}
type AvatarProps = {
  src: string
}

export const Avatar: FC<AvatarProps> = memo(({ src }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!src) {
      return
    }
    const image = new Image()
    image.src = src
    image.onload = () => {
      setReady(true)
    }
    image.onerror = () => {}
  }, [src])

  const colorMode = useAppStore((state) => state.colorMode)
  const randomColor = useMemo(() => {
    if (colorMode === 'dark') {
      return generateColorFromMode('dark', src)
    } else {
      return generateColorFromMode('light', src)
    }
  }, [colorMode, src])

  return (
    <div
      className={styles['guest-avatar']}
      style={ready ? undefined : { backgroundColor: randomColor }}
      data-avatar={src}
    >
      <LazyLoad>
        <div
          className={styles['avatar']}
          style={
            ready
              ? { backgroundImage: `url(${src})`, opacity: 1 }
              : { opacity: 0, backgroundColor: randomColor }
          }
        />
      </LazyLoad>
    </div>
  )
})
