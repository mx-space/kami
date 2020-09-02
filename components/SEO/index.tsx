import merge from 'lodash/merge'
import { observer } from 'utils/mobx'
import { NextSeo, NextSeoProps } from 'next-seo'
import type { OpenGraph } from 'next-seo/lib/types'
import { FC } from 'react'
import { useStore } from '../../common/store'
import configs from '../../configs'
import { getRandomImage } from '../../utils/utils'
import { useInitialData } from 'common/context/InitialDataContext'
type SEOProps = {
  title: string
  description?: string
  openGraph?: { type?: 'website' | 'article' } & OpenGraph
} & NextSeoProps

export const SEO: FC<SEOProps> = observer((props) => {
  const { title, description, openGraph, ...rest } = props
  const { userStore, appStore } = useStore()
  const { seo, user } = useInitialData()
  const Title = title + ' - ' + appStore.title
  return (
    <NextSeo
      {...{
        title,
        titleTemplate: '%s - ' + seo.title || appStore.title,
        openGraph: merge(
          {
            profile: {
              username: user.name || user.username,
            },
            type: 'article',
            locale: 'zh-cn',
            site_name: seo.title || appStore.title,
            description:
              description ||
              seo.description ||
              appStore.description ||
              userStore.introduce ||
              '',
            article: {
              authors: [user.name || (userStore.name as string)],
            },
            title: Title,
            images: [
              {
                url: getRandomImage().pop() as string,
                alt: title + ' - ' + seo.title || appStore.title,
              },
            ],
          } as OpenGraph,
          openGraph,
        ),
        description:
          description ||
          seo.description ||
          user.introduce ||
          appStore.description ||
          userStore.introduce ||
          '',
        twitter: {
          cardType: 'summary',
          site: configs.url,
        },

        ...rest,
      }}
    />
  )
})

export const Seo = SEO
