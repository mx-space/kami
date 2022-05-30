import { observer } from 'mobx-react-lite'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { message } from 'react-message-popup'
import { apiClient } from 'utils'

import { Loading } from '~/components/universal/Loading'
import { useStore } from '~/store'

import { ImageLazy } from '../../components/universal/Image'
import { Seo } from '../../components/universal/Seo'
import styles from './bangumi.module.css'

interface FavoriteBangumiType {
  title: string
  cover: string
  count: string | number
  miniCover: string
  countText: string
  id: number
}
const BangumiView: NextPage = () => {
  const [data, setData] = useState<null | FavoriteBangumiType[]>(null)
  const { userStore } = useStore()
  const master = userStore.master

  useEffect(() => {
    if (!master) {
      return
    }

    apiClient.serverless.proxy.kami.bangumi
      .get<any>()
      .then((res) => {
        setData(res)
      })
      .catch((err) => {
        message.error(err.message)
      })
  }, [master])

  if (!data) {
    return <Loading />
  }
  return (
    <main>
      <Head>
        <meta name="referrer" content="no-referrer" />
      </Head>
      <Seo title="追番" description="追番" />
      <section>
        <div className="grid grid-cols-4 <md:grid-cols-2 gap-8">
          {data.map((bangumi) => {
            return (
              <div key={bangumi.id}>
                <a
                  className={styles['bangumi-item']}
                  href={`https://www.bilibili.com/bangumi/media/md${bangumi.id}`}
                  target="_blank"
                  rel="nofollow"
                  data-total={bangumi.count}
                >
                  <ImageLazy
                    height={'100%'}
                    width={'100%'}
                    src={`https://i0.wp.com/${bangumi.cover.replace(
                      /^https?:\/\//,
                      '',
                    )}`}
                  />
                  <h4>
                    {bangumi.title}
                    <div className={styles['bangumi-status']}>
                      <div className={styles['bangumi-status-bar']}></div>
                      <p className="leading-6">{bangumi.countText ?? 'N/A'}</p>
                    </div>
                  </h4>
                </a>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default observer(BangumiView)
