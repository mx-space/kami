import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useEffect, useMemo, useState } from 'react'

import type { AggregateTop } from '@mx-space/api-client'

import { HomePageViewProvider } from '~/components/in-page/Home/context'
import { HomeIntro } from '~/components/in-page/Home/intro'
import { HomeRandomSay } from '~/components/in-page/Home/random-say'
import { HomeSections } from '~/components/in-page/Home/section'
import { Loading } from '~/components/ui/Loading'
import { useInitialData, useKamiConfig } from '~/hooks/app/use-initial-data'
import { getLocaleFromContext } from '~/i18n/navigation'
import { useLocaleFromContext } from '~/provider/locale-context'
import { omit } from '~/utils/_'
import { apiClient } from '~/utils/client'
import { Notice } from '~/utils/notice'

const fetchAggregateTop = (locale: string) =>
  apiClient.aggregate.proxy.top.get<AggregateTop>({
    params: { size: 5, lang: locale },
  })

type HomeAggregateTop = Omit<AggregateTop, 'says'>
type LocalizedAggregateTop = HomeAggregateTop & { __contentLocale?: string }

const IndexView: NextPage<LocalizedAggregateTop> = (props) => {
  const locale = useLocaleFromContext()
  const [aggregateTop, setAggregateTop] = useState<HomeAggregateTop>(props)
  const [contentLocale, setContentLocale] = useState(props.__contentLocale)

  // Sync props into state when getInitialProps returns fresh data on client-side navigation
  useEffect(() => {
    if (props.__contentLocale === locale) {
      setAggregateTop(props)
      setContentLocale(props.__contentLocale)
    }
  }, [locale, props])

  const initData = useInitialData()

  const config = useKamiConfig()
  const { function: fn } = config
  const { notification } = fn
  const doAnimation = Boolean(
    globalThis.history
      ? !history.backPath || history.backPath.length === 0
      : false,
  )

  useEffect(() => {
    Notice.shared.initNotice()
  }, [])

  useEffect(() => {
    if (!notification?.welcome) {
      return
    }
    const notificationOptions = notification.welcome
    const timer = setTimeout(() => {
      Notice.shared.createFrameNotification({
        title: notificationOptions.title,
        description: notificationOptions.message,
        avatar: notificationOptions.icon,
        onClick: () => {
          if (notificationOptions.toLink) {
            window.open(notificationOptions.toLink)
          }
        },
      })
    }, 1500)
    return () => {
      clearTimeout(timer)
    }
  }, [notification?.welcome])

  return (
    <main>
      <NextSeo
        title={`${config.site.title || initData.seo.title} · ${
          config.site.description || initData.seo.description
        }`}
        description={config.site.description || initData.seo.description}
      />
      <HomePageViewProvider
        value={useMemo(() => ({ doAnimation }), [doAnimation])}
      >
        <HomeIntro />

        <HomeRandomSay />
        {contentLocale === locale ? (
          <HomeSections {...aggregateTop} says={[]} />
        ) : (
          <Loading />
        )}
      </HomePageViewProvider>
    </main>
  )
}

IndexView.getInitialProps = async (ctx) => {
  const locale = getLocaleFromContext(ctx)
  const aggregateData = await fetchAggregateTop(locale)

  return { ...omit({ ...aggregateData }, ['says']), __contentLocale: locale }
}

export default IndexView
