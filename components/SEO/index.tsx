import merge from 'lodash/merge'
import { observer } from 'mobx-react'
import { NextSeo, NextSeoProps } from 'next-seo'
import type { OpenGraph } from 'next-seo/lib/types'
import { FC } from 'react'
import { useStore } from '../../common/store'
import configs from '../../configs'
import { getRandomImage } from '../../utils/utils'
type SEOProps = {
  title: string
  description?: string
  openGraph?: { type?: 'website' | 'article' } & OpenGraph
} & NextSeoProps

export const SEO: FC<SEOProps> = observer((props) => {
  const { title, description, openGraph, ...rest } = props
  const { userStore, appStore } = useStore()
  const Title = title + ' - ' + (configs.title || appStore.title)
  return (
    <NextSeo
      {...{
        title,
        titleTemplate: '%s - ' + (configs.title || appStore.title),
        openGraph: merge(
          {
            type: 'article',
            locale: 'zh-cn',
            site_name: configs.title || appStore.title,
            description:
              description ||
              configs.description ||
              appStore.description ||
              userStore.introduce,
            article: {
              authors: [
                (userStore.name as string) || configs.author,
                'mx-space',
              ],
            },
            title: Title,
            images: [
              {
                url: getRandomImage().pop() as string,
                alt: title + ' - ' + (configs.title || appStore.title),
              },
            ],
          },
          openGraph,
        ),
        description:
          description ||
          configs.description ||
          appStore.description ||
          userStore.introduce,
        twitter: {
          cardType: 'summary_large_image',
          site: configs.url,
        },

        ...rest,
      }}
    />
  )
})

export const Seo = SEO
