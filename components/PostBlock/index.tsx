import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import Router from 'next/router'
import React from 'react'
import removeMd from 'remove-markdown'
import { Stores, ViewportRecord } from 'store/types'
import { parseDate } from 'utils/time'
import styles from './index.module.scss'

interface Props {
  date: Date | string
  title: string
  text: string
  slug: string
}

@inject((store: Stores) => ({
  viewport: store.appStore.viewport,
}))
@observer
export class PostBlock extends React.Component<
  Props & { viewport?: ViewportRecord }
> {
  render() {
    const { date, title, text, slug, viewport } = this.props
    const parsedTime = viewport?.mobile
      ? parseDate(date, 'MM-DD ddd')
      : parseDate(date, 'YYYY-MM-DD ddd')
    const [d, week] = parsedTime.split(' ')

    const goToPost = () => {
      Router.push('/posts/[slug]', `/posts/${slug}`)
    }

    return (
      <>
        <h1 className={styles.head}>
          {d}
          <small>（{week}）</small>
          {!viewport?.mobile && <div className={styles.title}>{title}</div>}
        </h1>
        <div className={classNames('note-item', styles.text)}>
          {viewport?.mobile && <h2 className={styles.title}>{title}</h2>}
          <article className="note-content">
            {removeMd(text).slice(0, 250) + '..'}
          </article>
          <section className={styles.navigator}>
            <button className={styles.btn} onClick={goToPost}>
              查看原文
            </button>
          </section>
        </div>
      </>
    )
  }
}
