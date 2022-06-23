import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import Router from 'next/router'
import type { FC } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import removeMd from 'remove-markdown'

import type { PostModel } from '@mx-space/api-client'

import { IconTransition } from '~/components/universal/IconTransition'
import { PhPushPin, PhPushPinFill } from '~/components/universal/Icons'
import { useInitialData } from '~/hooks/use-initial-data'
import { useStore } from '~/store'
import { apiClient } from '~/utils/client'
import { springScrollToTop } from '~/utils/spring'
import { parseDate } from '~/utils/time'

import styles from './index.module.css'

interface PostBlockProps {
  post: PostModel
  onPinChange: () => any
}

export const PostBlock: FC<PostBlockProps> = observer((props) => {
  const {
    appStore: { viewport },
    userStore: { isLogged },
  } = useStore()

  const post = props.post

  const { created: date, title, slug, pin, text, id } = post

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
    const categorySlug = post.category?.slug ?? categoryMap.get(post.categoryId)
    Router.push('/posts/[category]/[slug]', `/posts/${categorySlug}/${slug}`)
    springScrollToTop()
  }, [categoryMap, post.category?.slug, post.categoryId, slug])
  const hasImage = post.images?.length > 0 && post.images[0].src

  const [pinState, setPinState] = useState(!!pin)

  const handlePin = async () => {
    await apiClient.post.proxy(id).patch({
      data: {
        pin: !pinState,
      },
    })
    setPinState(!pinState)
    props.onPinChange()
  }

  const pinEl = (
    <div
      className={clsx(
        'absolute right-0 top-0 bottom-0 items-center hidden overflow-hidden h-5 w-5',
        isLogged && 'cursor-pointer !inline-flex',
        !isLogged && pinState && 'pointer-events-none',
        pinState && 'text-red !inline-flex',
      )}
      role={'button'}
      onClick={handlePin}
    >
      <i className="absolute h-full w-full">
        <IconTransition
          currentState={pinState ? 'solid' : 'regular'}
          regularIcon={<PhPushPin />}
          solidIcon={<PhPushPinFill />}
        />
      </i>
    </div>
  )

  const tilteEl = (
    <>
      <div className={styles.title} onClick={goToPost}>
        {title}
      </div>
    </>
  )
  return (
    <>
      <h1 className={clsx(styles.head, 'headline')}>
        <div className="inline-flex items-center relative w-[calc(100%-1rem)]">
          {d}
          <small className="text-gray-2">（{week}）</small>
          {viewport.mobile && pinEl}
        </div>
        {!viewport?.mobile && (
          <>
            {tilteEl} {pinEl}
          </>
        )}
      </h1>
      <div className={styles.text}>
        {viewport?.mobile && tilteEl}
        <article
          className={clsx(
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
