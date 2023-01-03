import { observer } from 'mobx-react-lite'
import { NextSeo } from 'next-seo'
import type { FC } from 'react'
import { useEffect, useInsertionEffect } from 'react'

import type { AggregateRoot } from '@mx-space/api-client'
import { ModalStackProvider } from '@mx-space/kami-design/components/Modal/stack-context'

import { MetaFooter } from '~/components/biz/Meta/footer'
import { DynamicHeadMeta } from '~/components/biz/Meta/head'
import Loader from '~/components/universal/Loader'
import { useRootTrackerListener } from '~/hooks/use-analyze'
import { useCheckLogged } from '~/hooks/use-check-logged'
import { useCheckOldBrowser } from '~/hooks/use-check-old-browser'
import { useInitialData } from '~/hooks/use-initial-data'
import { useResizeScrollEvent } from '~/hooks/use-resize-scroll-event'
import { useRouterEvent } from '~/hooks/use-router-event'
import { useScreenMedia } from '~/hooks/use-screen-media'
import { printToConsole } from '~/utils/console'
import { loadStyleSheet } from '~/utils/load-script'

import { useStore } from '../../store'

export const Content: FC = observer((props) => {
  const { userStore: master, appUIStore } = useStore()

  useScreenMedia()
  const { check: checkBrowser } = useCheckOldBrowser()
  const { check: checkLogin } = useCheckLogged()
  useRouterEvent()
  useResizeScrollEvent()
  useRootTrackerListener()
  const initialData: AggregateRoot | null = useInitialData()

  useInsertionEffect(() => {
    loadStyleSheet(
      'https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@100;300;400;500&display=swap',
    )
  }, [])

  useEffect(() => {
    try {
      const { user } = initialData
      checkLogin()
      // set user
      master.setUser(user)
      import('../../socket/index').then(({ socketClient }) => {
        socketClient.initIO()
      })
    } finally {
      document.body.classList.remove('loading')
    }

    checkBrowser()
    printToConsole()
  }, [])

  return (
    <ModalStackProvider isMobileViewport={appUIStore.viewport.mobile}>
      <DynamicHeadMeta />
      <NextSeo
        title={`${initialData.seo.title} · ${initialData.seo.description}`}
        description={initialData.seo.description}
      />

      <div id="next">{props.children}</div>
      <Loader />
      <MetaFooter />
    </ModalStackProvider>
  )
})
