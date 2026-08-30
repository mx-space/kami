import merge from 'lodash-es/merge'
import type { NextSeoProps } from 'next-seo'
import { NextSeo } from 'next-seo'
import type { OpenGraph } from 'next-seo/lib/types'
import type { FC } from 'react'
import { createElement, memo } from 'react'

import { useInitialData, useKamiConfig } from '~/hooks/app/use-initial-data'
import { useRandomImage } from '~/hooks/app/use-kami-theme'

type SEOProps = {
  title: string
  description?: string
  openGraph?: { type?: 'website' | 'article' } & OpenGraph
  image?: string
  canUseRandomImage?: boolean
} & NextSeoProps

export const Seo: FC<SEOProps> = memo((props) => {
  const {
    title,
    description,
    openGraph,
    image,
    canUseRandomImage = true,
    ...rest
  } = props

  const {
    url: { webUrl },
    seo,
    user,
  } = useInitialData()
  const config = useKamiConfig()
  const siteTitle = config.site.title || seo.title
  const siteDescription = config.site.description || seo.description
  const nextTitle = `${title} - ${siteTitle}`

  const [randomImage] = useRandomImage()

  return createElement(NextSeo, {
    title,
    titleTemplate: `%s - ${siteTitle}`,
    openGraph: merge(
      {
        profile: {
          username: user.name || user.username,
        },
        type: 'article',
        locale: 'zh-cn',
        site_name: siteTitle || '',
        description: description || siteDescription || user.introduce || '',
        article: {
          authors: [user.name],
        },
        title: nextTitle,
        images:
          image || canUseRandomImage
            ? [
                {
                  url: image || randomImage,
                  alt: `${title} - ${siteTitle}`,
                },
              ]
            : void 0,
      } as OpenGraph,
      openGraph,
    ),
    description: description || siteDescription || user.introduce || '',
    twitter: {
      cardType: 'summary',
      site: webUrl,
    },

    ...rest,
  })
})
Seo.displayName = 'Seo'
