import clsx from 'clsx'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import styles from './link-card.module.css'

export enum LinkCardSource {
  Self,
  GHRepo,
}
export interface LinkCardProps {
  link: string
  source: LinkCardSource
}
export const LinkCard: FC<LinkCardProps> = (props) => {
  const { link, source } = props
  const [loading, setLoading] = useState(true)
  const fetchInfo = useCallback(() => {
    setLoading(true)
  }, [source, link])

  const { ref } = useInView({
    triggerOnce: true,
    onChange(inView) {
      if (!inView) {
        return
      }

      fetchInfo()
    },
  })

  if (loading) {
    return <Skeleton />
  }

  return (
    <div ref={ref} className={styles['card-grid']}>
      <div className={styles['contents']}>
        <div className={styles['title']}>
          标题 1A标题 1A标题 1A标题 1A标题 1A标题 1A标题 1A标题 1A标题 1A标题
          1A标题 1A标题 1A标题 1A标题 1A标题 1A标
        </div>
        <div className={styles['desc']}>
          一段描述一段描述一段描述一段描述一段描述一段描述一段描述一段描述一段描述一段描述一段描述一段描述
        </div>
      </div>
      <div className={styles['image']}>
        <img src="" />
      </div>
    </div>
  )
}

const Skeleton = () => {
  return (
    <div className={clsx(styles['card-grid'], styles['skeleton'])}>
      <div className={styles['contents']}>
        <div className={styles['title']} />
        <div className={styles['desc']} />
      </div>
      <div className={styles['image']} />
    </div>
  )
}
