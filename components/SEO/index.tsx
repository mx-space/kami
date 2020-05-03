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
  const { appStore } = useStore()
  return (
    <NextSeo
      {...{ title: title + ' - ' + (configs.title || appStore.title), ...rest }}
    />
  )
})
