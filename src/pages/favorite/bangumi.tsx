/*
 * @Author: Innei
 * @Date: 2020-12-18 12:15:37
 * @LastEditTime: 2021-06-12 19:32:43
 * @LastEditors: Innei
 * @FilePath: /web/pages/favorite/bangumi.tsx
 * @Mark: Coding with Love
 */
import { FavoriteBangumiType } from '@mx-space/extra'
import axios from 'axios'
import configs from 'configs'
import { NextPage } from 'next'
import Head from 'next/head'
import { isDev } from 'utils'
import { ImageLazy } from '../../components/universal/Image'
import { Seo } from '../../components/universal/Seo'

const BangumiView: NextPage<{ data: FavoriteBangumiType[] }> = (props) => {
  return (
    <main>
      <Head>
        <meta name="referrer" content="no-referrer" />
      </Head>
      <Seo
        {...{
          title: '追番',
          openGraph: { type: 'website' },
        }}
      />
      <section className={'kami-bangumi'}>
        <div className="row">
          {props.data.map((bangumi) => {
            return (
              <div className="col-6 col-s-4 col-m-3" key={bangumi.id}>
                <a
                  className="bangumi-item"
                  href={`https://www.bilibili.com/bangumi/media/md${bangumi.id}`}
                  target="_blank"
                  rel="nofollow"
                  data-total={bangumi.count}
                  style={{ position: 'relative' }}
                >
                  <ImageLazy
                    height={'100%'}
                    width={'100%'}
                    src={
                      'https://i0.wp.com/' +
                      bangumi.cover.replace(/^https?:\/\//, '')
                    }
                  />
                  <h4>
                    {bangumi.title}
                    <div className="bangumi-status">
                      <div className="bangumi-status-bar"></div>
                      <p>{bangumi.countText ?? 'N/A'}</p>
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

BangumiView.getInitialProps = async (ctx) => {
  const baseUrl = isDev ? 'http://localhost:2323' : configs.url
  const $api = axios.create({
    baseURL:
      baseUrl ??
      // @ts-ignore
      (ctx.req?.connection?.encrypted ? 'https' : 'http') +
        '://' +
        ctx.req?.headers.host,
  })

  const { data } = await $api.get('/api/bilibili/bangumi', {
    params: {
      uid: configs.biliId,
    },
  })

  return data
}

export default BangumiView
