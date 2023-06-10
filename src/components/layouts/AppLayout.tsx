import { NextSeo } from 'next-seo'
import type { FC } from 'react'
import { useInsertionEffect } from 'react'

import type { AggregateRoot } from '@mx-space/api-client'

import { MetaFooter } from '~/components/app/Meta/footer'
import { DynamicHeadMeta } from '~/components/app/Meta/head'
import Loader from '~/components/widgets/Loader'
import { useRootTrackerListener } from '~/hooks/app/use-analyze'
import { useInitialData } from '~/hooks/app/use-initial-data'
import { useResizeScrollEvent } from '~/hooks/app/use-resize-scroll-event'
import { useRouterEvent } from '~/hooks/app/use-router-event'
import { useScreenMedia } from '~/hooks/ui/use-screen-media'
import { loadStyleSheet } from '~/utils/load-script'

export const AppLayout: FC = (props) => {
  useScreenMedia()

  useRouterEvent()
  useResizeScrollEvent()
  useRootTrackerListener()
  const initialData: AggregateRoot | null = useInitialData()

  useInsertionEffect(() => {
    loadStyleSheet(
      'https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@100;300;400;500&display=swap',
    )
  }, [])

  return (
    <>
      <DynamicHeadMeta />
      <NextSeo
        title={`${initialData.seo.title} · ${initialData.seo.description}`}
        description={initialData.seo.description}
      />

      <div id="next">{props.children}</div>
      <Loader />
      <MetaFooter />
    </>
  )
}
