/*
 * @Author: Innei
 * @Date: 2020-12-18 12:15:37
 * @LastEditTime: 2021-02-11 15:26:45
 * @LastEditors: Innei
 * @FilePath: /web/pages/favorite/bangumi.tsx
 * @Mark: Coding with Love
 */
import { FavoriteBangumiType } from '@mx-space/extra'
import configs from 'configs'
import { NextPage } from 'next'
import Head from 'next/head'
import { ImageLazy } from '../../components/Image'
import { FavoriteNav } from '../../components/Navigation/nav'
import { Seo } from '../../components/SEO'
const BangumiView: NextPage<{ data: FavoriteBangumiType[] }> = (props) => {
  return (
    <main>
      <FavoriteNav index={1} />
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
                    useRandomBackgroundColor
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
  const baseUrl = configs.url
  const prefixUrl =
    baseUrl ??
    // @ts-ignore
    (ctx.req?.connection?.encrypted ? 'https' : 'http') +
      '://' +
      ctx.req?.headers.host

  const { data } = await (
    await fetch(prefixUrl + '/api/bilibili/bangumi?uid=' + configs.biliId)
  ).json()

  return data
}

export default BangumiView
