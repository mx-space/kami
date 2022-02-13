// organize-imports-ignore
import 'windi.css'
// organize-imports-ignore
import 'assets/styles/main.css'

import { AggregateRoot } from '@mx-space/api-client'
import { InitialContextProvider, InitialDataType } from 'context/initial-data'
import { useCheckLogged } from 'hooks/use-check-logged'
import { useCheckOldBrowser } from 'hooks/use-check-old-browser'
import { useInitialData, useThemeConfig } from 'hooks/use-initial-data'
import { useResizeScrollEvent } from 'hooks/use-resize-scroll-event'
import { useRouterEvent } from 'hooks/use-router-event'
import { useScreenMedia } from 'hooks/use-screen-media'
import { NoDataErrorView } from 'components/universal/Error/no-data'
import Loader from 'components/universal/Loader'
import { DynamicHeaderMeta } from 'components/universal/Meta/header'
import { BasicLayout } from 'components/layouts/BasicLayout'
import { NextSeo } from 'next-seo'
import NextApp, { AppContext } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'

import React, { FC, memo, useEffect, useMemo } from 'react'
import useMount from 'react-use/lib/useMount'
import { KamiConfig } from 'types/config'
import { $axios, apiClient } from 'utils/client'
import { printToConsole } from 'utils/console'
import { observer } from 'mobx-react-lite'

import Package from '~/package.json'

import client from '../socket'
import { useStore } from '../store'
import { isServerSide, TokenKey } from '../utils'
import { RootStoreProvider } from 'context/root-store'
import { DebugLayout } from 'components/layouts/DebugLayout'

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

  return (
    <>
      <DynamicHeaderMeta />
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
  const { initData, Component, pageProps } = props

  const Inner = useMemo(() => {
    // 兜底页
    return initData.aggregateData ? (
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
    ) : (
      <NoDataErrorView />
    )
  }, [Component, initData.aggregateData, pageProps])
  return (
    <RootStoreProvider>
      <InitialContextProvider value={initData}>{Inner}</InitialContextProvider>
    </RootStoreProvider>
  )
}
const Wrapper = memo((props) => {
  const router = useRouter()
  if (router.route.startsWith('/dev')) {
    return <DebugLayout>{props.children}</DebugLayout>
  }
  return (
    <BasicLayout>
      <Content>{props.children}</Content>
    </BasicLayout>
  )
})
// @ts-ignore
App.getInitialProps = async (props: AppContext) => {
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
      request.headers['user-agent'] +
      ' mx-space/kami SSR server' +
      `/${version}`

    // forward auth token
    const cookie = request.headers.cookie
    if (cookie) {
      const token = cookie
        .split(';')
        .find((str) => {
          const [key] = str.split('=')

          return key === TokenKey
        })
        ?.split('=')[1]
      if (token) {
        $axios.defaults.headers['Authorization'] =
          'bearer ' + token.replace(/^Bearer\s/i, '')
      }

      // $axios.defaults.headers['cookie'] = cookie
    }
  }

  async function getInitialData() {
    const [aggregateDataState, configSnippetState] = await Promise.allSettled([
      apiClient.aggregate.getAggregateData(),
      apiClient.snippet.getByReferenceAndName<KamiConfig>(
        'theme',
        process.env.NEXT_PUBLIC_SNIPPET_NAME || 'kami',
      ),
    ])

    let aggregateData: AggregateRoot | null = null
    let configSnippet: KamiConfig | null = null
    let reason = null as null | string
    if (aggregateDataState.status === 'fulfilled') {
      aggregateData = aggregateDataState.value
    } else {
      //  TODO 请求异常处理
      reason = aggregateDataState?.reason
      console.error('Fetch aggregate data error: ' + aggregateDataState.reason)
    }

    if (configSnippetState.status === 'fulfilled') {
      configSnippet = { ...configSnippetState.value }
    }

    return { aggregateData, config: configSnippet, reason }
  }
  const initialData = globalThis.data ?? (await getInitialData())
  const appProps = await (async () => {
    try {
      return await NextApp.getInitialProps(props)
    } catch (e) {
      // 只有无数据 也就是 服务端不跑起来 或者接口不对的时候 捕获异常
      // 这是为什么呢 说来说去还是 nextjs 太辣鸡了 只能各种 hack
      // 只能这样了

      if (!initialData.reason) {
        // 这里抛出，和官网直接 await getProps 一样，异常走到 _error 处理
        throw e
      }
      // 这里捕获， 为了走全局无数据页
      return null
    }
  })()
  return {
    ...appProps,
    initData: initialData,
  }
}

export default App
