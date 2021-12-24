// organize-imports-ignore
import 'windi.css'
// organize-imports-ignore
import 'assets/styles/main.scss'
// organize-imports-ignore
import 'normalize.css/normalize.css'

import { AggregateRoot } from '@mx-space/api-client'
import { DropdownProvider } from 'common/context/dropdown'
import {
  InitialContextProvider,
  InitialDataType,
} from 'common/context/initial-data'
import { useCheckLogged } from 'common/hooks/use-check-logged'
import { useCheckOldBrowser } from 'common/hooks/use-check-old-browser'
import { useInitialData, useThemeConfig } from 'common/hooks/use-initial-data'
import { useMediaToggle } from 'common/hooks/use-media-toggle'
import { useResizeScrollEvent } from 'common/hooks/use-resize-scroll-event'
import { useRouterEvent } from 'common/hooks/use-router-event'
import Loader from 'components/Loader'
import { BasicLayout } from 'layouts/BasicLayout'
import { NextSeo } from 'next-seo'
import NextApp, { AppContext } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useMemo } from 'react'
import useMount from 'react-use/lib/useMount'
import { KamiConfig } from 'types/config'
import { $axios, apiClient } from 'utils/client'
import { printToConsole } from 'utils/console'
import { observer } from 'utils/mobx'
import Package from '~/package.json'
import client from '../common/socket'
import { useStore } from '../common/store'
import { PageModel } from '../common/store/types'
import { isServerSide } from '../utils'

const version = `v${Package.version}` || ''

if (isServerSide()) {
  React.useLayoutEffect = useEffect
}

const Content: FC = observer((props) => {
  const {
    appStore: app,
    userStore: master,
    categoryStore: category,
  } = useStore()

  useMediaToggle()
  const { check: checkBrowser } = useCheckOldBrowser()
  const { check: checkLogin } = useCheckLogged()
  useRouterEvent()
  useResizeScrollEvent()
  const initialData = useInitialData()
  const themeConfig = useThemeConfig()
  useMount(() => {
    {
      const data = initialData
      const { seo, user, pageMeta, categories } = data
      // set user
      master.setUser(user)
      document.body.classList.remove('loading')
      // set page
      app.setPage(pageMeta as PageModel[])
      category.setCategory(categories)
      app.setConfig({ seo })
    }
    checkLogin()
    checkBrowser()
    printToConsole()
    // connect to ws
    client.initIO()
  })

  if (!initialData) {
    // TODO: No data page
    return <div>No Data fetched</div>
  }

  if (!themeConfig) {
    return <div>No Config fetched</div>
  }
  return (
    <>
      <Head>
        {initialData.seo.keywords && (
          <meta name="keywords" content={initialData.seo.keywords.join(',')} />
        )}
      </Head>
      <NextSeo
        title={initialData.seo.title + ' · ' + initialData.seo.description}
        description={initialData.seo.description}
      />

      <div id="next">{props.children}</div>
      <Loader />
    </>
  )
})

interface DataModel {
  initData: InitialDataType
}
const App: FC<DataModel & { Component: any; pageProps: any; err: any }> = (
  props,
) => {
  const { initData, Component, pageProps, err } = props

  const router = useRouter()

  const Comp = useMemo(() => {
    if (router.route.startsWith('/dev')) {
      return <Component {...pageProps} err={err} />
    }
    return (
      <BasicLayout>
        <Component {...pageProps} err={err} />
      </BasicLayout>
    )
  }, [Component, err, pageProps, router.route])

  return (
    <InitialContextProvider value={initData}>
      <DropdownProvider>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <Content>{Comp}</Content>
      </DropdownProvider>
    </InitialContextProvider>
  )
}
{
  let initData: any = null
  // cache 5 mins
  setInterval(() => {
    initData = null
  }, 1000 * 60 * 5)
  // @ts-ignore
  App.getInitialProps = async (props: AppContext) => {
    const appProps = await NextApp.getInitialProps(props)

    const ctx = props.ctx
    const request = ctx.req

    if (request && isServerSide()) {
      let ip =
        ((request.headers['x-forwarded-for'] ||
          request.connection.remoteAddress ||
          request.socket.remoteAddress) as string) || undefined
      if (ip && ip.split(',').length > 0) {
        ip = ip.split(',')[0]
      }
      ip && ($axios.defaults.headers.common['x-forwarded-for'] = ip as string)

      $axios.defaults.headers.common['User-Agent'] =
        request.headers['user-agent'] + ' mx-space SSR server' + `/${version}`
    }

    async function getInitialData() {
      const [aggregateDataState, configSnippetState] = await Promise.allSettled(
        [
          apiClient.aggregate.getAggregateData(),
          apiClient.snippet.getByReferenceAndName<KamiConfig>('theme', 'kami'),
        ],
      )

      let aggregateData: AggregateRoot | null = null
      let configSnippet: KamiConfig | null = null
      if (aggregateDataState.status === 'fulfilled') {
        aggregateData = aggregateDataState.value
      } else {
        //  TODO 请求异常处理

        console.error(aggregateDataState.reason)
      }

      if (configSnippetState.status === 'fulfilled') {
        configSnippet = configSnippetState.value.data
      }

      return { aggregateData, config: configSnippet }
    }

    initData = initData || (await getInitialData())

    return { ...appProps, initData }
  }
}
export default App
