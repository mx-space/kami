import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { AggregateTop } from '@mx-space/api-client'

import { HomePageViewProvider } from '~/components/in-page/Home/context'
import { HomeIntro } from '~/components/in-page/Home/intro'
import { HomeRandomSay } from '~/components/in-page/Home/random-say'
import { HomeSections } from '~/components/in-page/Home/section'
import { useInitialData, useKamiConfig } from '~/hooks/app/use-initial-data'
import { getLocaleFromContext, useLocale } from '~/i18n/navigation'
import { omit } from '~/utils/_'
import { apiClient, setRequestLocale } from '~/utils/client'
import { Notice } from '~/utils/notice'

const IndexView: NextPage<AggregateTop> = (props) => {
  const locale = useLocale()
  const [aggregateTop, setAggregateTop] = useState<AggregateTop>(props)
  const initData = useInitialData()

  const { function: fn } = useKamiConfig()
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

  const prevLocale = useRef(locale)
  useEffect(() => {
    if (prevLocale.current === locale) return
    prevLocale.current = locale
    apiClient.aggregate.getTop().then((res) => {
      setAggregateTop(omit({ ...res }, ['says']) as unknown as AggregateTop)
    })
  }, [locale])

  return (
    <main>
      <NextSeo
        title={`${initData.seo.title} · ${initData.seo.description}`}
        description={initData.seo.description}
      />
      <HomePageViewProvider
        value={useMemo(() => ({ doAnimation }), [doAnimation])}
      >
        <HomeIntro />

        <HomeRandomSay />
        <HomeSections {...aggregateTop} />
      </HomePageViewProvider>
    </main>
  )
}

IndexView.getInitialProps = async (ctx) => {
  setRequestLocale(getLocaleFromContext(ctx))
  const aggregateData = await apiClient.aggregate.getTop()

  return omit({ ...aggregateData }, ['says']) as any
}

export default IndexView
