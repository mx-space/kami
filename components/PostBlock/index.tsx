import React, { FC } from 'react'
import removeMd from 'remove-markdown'
import { parseDate } from 'utils/time'
import styles from './index.module.scss'
import Router from 'next/router'
interface Props {
  date: Date | string
  title: string
  text: string
  slug: string
}

export const PostBlock: FC<Props> = ({ date, title, text, slug }) => {
  const parsedTime = parseDate(date, 'YYYY-MM-DD ddd')
  const [d, week] = parsedTime.split(' ')

  const goToPost = () => {
    Router.push('/posts/[slug]', `/posts/${slug}`)
  }

  return (
    <>
      <h1 className={styles.head}>
        {d}
        <small>（{week}）</small>
        <div className={styles.title}>{title}</div>
      </h1>
      <div className="note-item">
        <article className="note-content">
          {removeMd(text).slice(0, 250) + '..'}
        </article>
        <section className={styles.navigator}>
          <button className={styles.btn} onClick={goToPost}>
            加载更多
          </button>
        </section>
      </div>
    </>
  )
}
