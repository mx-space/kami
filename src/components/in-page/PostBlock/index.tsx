import classNames from 'clsx'
import { observer } from 'mobx-react-lite'
import Router from 'next/router'
import type { FC } from 'react'
import React, { useCallback, useMemo } from 'react'
import removeMd from 'remove-markdown'

import type { PostModel } from '@mx-space/api-client'

import { useInitialData } from '~/hooks/use-initial-data'
import { useStore } from '~/store'
import { springScrollToTop } from '~/utils/spring'
import { parseDate } from '~/utils/time'

import styles from './index.module.css'

interface PostBlockProps {
  date: Date | string
  title: string
  text: string
  slug: string
  raw: PostModel
  map?: Map<string, string>
}

export const PostBlock: FC<PostBlockProps> = observer((props) => {
  const {
    appStore: { viewport },
  } = useStore()
  const { date, title, text, slug, raw } = props
  const parsedTime = viewport?.mobile
    ? parseDate(date, 'MM-DD ddd')
    : parseDate(date, 'YYYY-MM-DD ddd')
  const [d, week] = parsedTime.split(' ')
  const initialData = useInitialData()
  const categoryMap = useMemo(() => {
    const categories = initialData.categories

    const map = new Map()

    categories.map((category) => {
      map.set(category.id, category.slug)
    })
    return map
  }, [initialData.categories])
  const goToPost = useCallback(() => {
    const categorySlug = raw.category?.slug ?? categoryMap.get(raw.categoryId)
    Router.push('/posts/[category]/[slug]', `/posts/${categorySlug}/${slug}`)
    springScrollToTop()
  }, [categoryMap, raw.category?.slug, raw.categoryId, slug])
  const hasImage = props.raw.images?.length > 0 && props.raw.images[0].src
  return (
    <>
      <h1 className={classNames(styles.head, 'headline')}>
        <div className="inline-flex items-center">
          {d}
          <small className="text-gray-2">（{week}）</small>
        </div>
        {!viewport?.mobile && (
          <div className={styles.title} onClick={goToPost}>
            {title}
          </div>
        )}
      </h1>
      <div className={styles.text}>
        {viewport?.mobile && (
          <h2 className={styles.title} onClick={goToPost}>
            {title}
          </h2>
        )}
        <article
          className={classNames(
            styles['content'],
            hasImage ? styles['has-image'] : null,
          )}
        >
          {hasImage && (
            <div
              className={styles['post-image-preview']}
              style={{ backgroundImage: `url(${hasImage})` }}
            />
          )}
          <p>
            {useMemo(() => {
              const r = removeMd(text)
              return r.length >= 250 ? `${r.slice(0, 250)}..` : r
            }, [text])}
          </p>
          <div className="mb-10"></div>
        </article>
        <section className={styles.navigator}>
          <button className={styles.btn} onClick={goToPost}>
            查看原文
          </button>
        </section>
      </div>
      <div className="pb-8 mb-4"></div>
    </>
  )
})
