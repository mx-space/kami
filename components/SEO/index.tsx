import { FC } from 'react'
import { NextSeo, NextSeoProps } from 'next-seo'
import configs from '../../configs'
import { useStore } from '../../store'
import { observer } from 'mobx-react'

type SEOProps = {
  title: string
} & NextSeoProps

export const SEO: FC<SEOProps> = observer((props) => {
  const { title, ...rest } = props
  const { userStore, appStore } = useStore()
  return (
    <NextSeo
      {...{
        title: title + ' - ' + (configs.title || appStore.title),
        openGraph: {
          type: 'website',
          locale: 'zh-cn',
          site_name: configs.title || appStore.title,
          description:
            configs.description || appStore.description || userStore.introduce,
        },
        ...rest,
      }}
    />
  )
})
