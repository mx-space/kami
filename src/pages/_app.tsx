// organize-imports-ignore
import 'windi.css'
// organize-imports-ignore
import 'assets/styles/main.css'
// organize-imports-ignore
// import 'normalize.css/normalize.css'

import { AggregateRoot } from '@mx-space/api-client'
import { DropdownProvider } from 'common/context/dropdown'
import {
  InitialContextProvider,
  InitialDataType,
} from 'common/context/initial-data'
import { useCheckLogged } from 'common/hooks/use-check-logged'
import { useCheckOldBrowser } from 'common/hooks/use-check-old-browser'
import { useInitialData, useThemeConfig } from 'common/hooks/use-initial-data'
import { useResizeScrollEvent } from 'common/hooks/use-resize-scroll-event'
import { useRouterEvent } from 'common/hooks/use-router-event'
import { useScreenMedia } from 'common/hooks/use-screen-media'
import { NoConfigErrorView } from 'components/Error/no-config'
import { NoDataErrorView } from 'components/Error/no-data'
import Loader from 'components/Loader'
import { DynamicHeaderMeta } from 'components/Meta/header'
import { BasicLayout } from 'layouts/BasicLayout'
import { NextSeo } from 'next-seo'
import NextApp, { AppContext } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'

import React, { FC, useEffect, useMemo } from 'react'
import useMount from 'react-use/lib/useMount'
import { KamiConfig } from 'types/config'
import { $axios, apiClient } from 'utils/client'
import { printToConsole } from 'utils/console'
import { observer } from 'utils/mobx'

import Package from '~/package.json'

import client from '../common/socket'
import { useStore } from '../common/store'
import { isServerSide } from '../utils'
import { RootStoreProvider } from 'common/context/root-store'
import { DebugLayout } from 'layouts/DebugLayout'

const version = `v${Package.version}` || ''

if (isServerSide()) {
  React.useLayoutEffect = useEffect
}

const Content: FC = observer((props) => {
  const { userStore: master } = useStore()

  useScreenMedia()
  const { check: checkBrowser } = useCheckOldBrowser()
  const { check: checkLogin } = useCheckLogged()
  useRouterEvent()
  useResizeScrollEvent()
  const initialData: AggregateRoot | null = useInitialData()
  const themeConfig = useThemeConfig()
  useMount(() => {
    {
      try {
        const { user } = initialData
        // set user
        master.setUser(user)
        checkLogin()
        client.initIO()
      } finally {
        document.body.classList.remove('loading')
      }
    }
    checkBrowser()
    printToConsole()
  })

  if (!initialData) {
    return <NoDataErrorView />
  }

  if (!themeConfig) {
    return <NoConfigErrorView />
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

      {themeConfig.function.analyze.enable && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${themeConfig.function.analyze.ga}`}
          />
          <Script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${themeConfig.function.analyze.ga}', {page_path: window.location.pathname,});`,
            }}
          />
        </>
      )}
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
      return (
        <DebugLayout>
          <Component {...pageProps} />
        </DebugLayout>
      )
    }
    return (
      <BasicLayout>
        <Component {...pageProps} />
      </BasicLayout>
    )
  }, [Component, pageProps, router.route])

  return (
    <RootStoreProvider>
      <InitialContextProvider value={initData}>
        {/* <DropdownProvider> */}
        <DynamicHeaderMeta />
        <Content>{Comp}</Content>
        {/* </DropdownProvider> */}
      </InitialContextProvider>
    </RootStoreProvider>
  )
}

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
    const [aggregateDataState, configSnippetState] = await Promise.allSettled([
      apiClient.aggregate.getAggregateData(),
      apiClient.snippet.getByReferenceAndName<KamiConfig>('theme', 'kami'),
    ])

    let aggregateData: AggregateRoot | null = null
    let configSnippet: KamiConfig | null = null
    if (aggregateDataState.status === 'fulfilled') {
      aggregateData = aggregateDataState.value
    } else {
      //  TODO 请求异常处理

      console.error(aggregateDataState.reason)
    }

    if (configSnippetState.status === 'fulfilled') {
      configSnippet = { ...configSnippetState.value }
    }

    return { aggregateData, config: configSnippet }
  }

  return {
    ...appProps,
    initData: globalThis.data ?? (await getInitialData()),
  }
}

export default App
