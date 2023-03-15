import merge from 'lodash-es/merge'
import type { NextSeoProps } from 'next-seo'
import { NextSeo } from 'next-seo'
import type { OpenGraph } from 'next-seo/lib/types'
import type { FC } from 'react'
import { memo } from 'react'

import { useInitialData } from '~/hooks/use-initial-data'
import { useRandomImage } from '~/hooks/use-kami'

type SEOProps = {
  title: string
  description?: string
  openGraph?: { type?: 'website' | 'article' } & OpenGraph
} & NextSeoProps

export const SEO: FC<SEOProps> = memo((props) => {
  const { title, description, openGraph, ...rest } = props

  const {
    url: { webUrl },
    seo,
    user,
  } = useInitialData()
  const Title = `${title} - ${seo.title}`

  const [randomImage] = useRandomImage()

  return (
    <NextSeo
      {...{
        title,
        titleTemplate: `%s - ${seo.title}`,
        openGraph: merge(
          {
            profile: {
              username: user.name || user.username,
            },
            type: 'article',
            locale: 'zh-cn',
            site_name: seo.title || '',
            description: description || seo.description || user.introduce || '',
            article: {
              authors: [user.name],
            },
            title: Title,
            images: [
              {
                url: randomImage,
                alt: `${title} - ${seo.title}`,
              },
            ],
          } as OpenGraph,
          openGraph,
        ),
        description: description || seo.description || user.introduce || '',
        twitter: {
          cardType: 'summary',
          site: webUrl,
        },

        ...rest,
      }}
    />
  )
})

export const Seo = SEO
