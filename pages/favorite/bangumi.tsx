import { NextPage } from 'next'
import { FavoriteNav } from '../../components/Navigation/nav'
import { FavoriteBangumiType } from '@mx-space/extra'
import axios from 'axios'
import configs from 'configs'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
const BangumiView: NextPage<{ data: FavoriteBangumiType[] }> = (props) => {
  return (
    <main>
      <FavoriteNav index={1} />
      <Head>
        <meta name="referrer" content="no-referrer" />
      </Head>
      <NextSeo
        {...{
          title: '追番 - ' + configs.title,
        }}
      />
      <section className={'paul-bangumi'}>
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
                  data-test=""
                >
                  <img src={'/_extra/cover?src=' + bangumi.cover} />
                  <h4>
                    {bangumi.title}
                    <div className="bangumi-status">
                      <div className="bangumi-status-bar"></div>
                      <p>{bangumi.countText}</p>
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

BangumiView.getInitialProps = async () => {
  const $api = axios.create({
    baseURL: process.env.BASEURL,
  })
  const { data } = await $api.get('/_extra/bangumi', {
    params: {
      uid: configs.biliId,
    },
  })

  return data
}

export default BangumiView
