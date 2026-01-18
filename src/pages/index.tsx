import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useEffect, useMemo } from 'react'

import type { AggregateTop } from '@mx-space/api-client'

import { HomePageViewProvider } from '~/components/in-page/Home/context'
import { HomeIntro } from '~/components/in-page/Home/intro'
import { HomeRandomSay } from '~/components/in-page/Home/random-say'
import { HomeSections } from '~/components/in-page/Home/section'
import { useInitialData, useKamiConfig } from '~/hooks/app/use-initial-data'
import { omit } from '~/utils/_'
import { $axios, apiClient } from '~/utils/client'
import { Notice } from '~/utils/notice'

const IndexView: NextPage<AggregateTop> = (props) => {
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
        <HomeSections {...props} />
      </HomePageViewProvider>
    </main>
  )
}

IndexView.getInitialProps = async () => {
  try {
    const aggregateData = await apiClient.aggregate.getTop()
    return omit({ ...aggregateData }, ['says']) as any
  } catch {
    const [posts, notes] = await Promise.all([
      apiClient.post
        .getList(1, 5)
        .then((data) => data.data)
        .catch(() => []),
      $axios
        .get('/notes', { params: { page: 1, size: 5 } })
        .then((res) => res.data.data)
        .catch(() =>
          $axios
            .get('/notes/latest')
            .then((res) => [res.data.data])
            .catch(() => []),
        ),
    ])

    return {
      posts,
      notes,
    } as any
  }
}

export default IndexView
