import { observer } from 'mobx-react-lite'
import rc from 'randomcolor'
import { FC, useEffect, useMemo, useState } from 'react'
import LazyLoad from 'react-lazyload'
import { useStore } from 'store'
import styles from './index.module.css'

const generateColorFromMode = (
  mode: 'bright' | 'light' | 'dark' | 'random' | undefined,
) => {
  return rc({ luminosity: mode, alpha: 0.28, format: 'hex' })
}
type AvatarProps = {
  src: string
}

export const Avatar: FC<AvatarProps> = observer(({ src }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!src) {
      return
    }
    const image = new Image()
    image.src = src
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      setReady(true)
    }
  }, [src])
  const { appStore } = useStore()
  const randomColor = useMemo(() => {
    if (appStore.colorMode === 'dark') {
      return generateColorFromMode('dark')
    } else {
      return generateColorFromMode('light')
    }
  }, [appStore.colorMode])

  return (
    <div
      className={styles['guest-avatar']}
      style={ready ? undefined : { backgroundColor: randomColor }}
      data-avatar={src}
    >
      <LazyLoad offset={250}>
        <div
          className={styles['avatar']}
          style={
            ready ? { backgroundImage: `url(${src})`, opacity: 1 } : undefined
          }
        ></div>
      </LazyLoad>
    </div>
  )
})
