// prettier-ignore-start
import 'windi.css'
import 'assets/styles/main.css'
import '../../third/qp/index.css'

// prettier-ignore-end
import { BasicLayout } from 'components/layouts/BasicLayout'
import { DebugLayout } from 'components/layouts/DebugLayout'
import { NoDataErrorView } from 'components/universal/Error/no-data'
import Loader from 'components/universal/Loader'
import { MetaFooter } from 'components/universal/Meta/footer'
import { DynamicHeadMeta } from 'components/universal/Meta/head'
import { defaultConfigs } from 'configs.default'
import type { InitialDataType } from 'context/initial-data'
import { InitialContextProvider } from 'context/initial-data'
import { RootStoreProvider } from 'context/root-store'
import { useCheckLogged } from 'hooks/use-check-logged'
import { useCheckOldBrowser } from 'hooks/use-check-old-browser'
import { useInitialData } from 'hooks/use-initial-data'
import { useResizeScrollEvent } from 'hooks/use-resize-scroll-event'
import { useRouterEvent } from 'hooks/use-router-event'
import { useScreenMedia } from 'hooks/use-screen-media'
import { observer } from 'mobx-react-lite'
import { NextSeo } from 'next-seo'
import type { AppContext } from 'next/app'
import NextApp from 'next/app'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { memo, useEffect, useMemo } from 'react'
import type { KamiConfig } from 'types/config'
import { $axios, apiClient } from 'utils/client'
import { printToConsole } from 'utils/console'

import type { AggregateRoot } from '@mx-space/api-client'

import Package from '~/package.json'

import client from '../socket'
import { useStore } from '../store'
import { TokenKey, isServerSide, loadStyleSheet } from '../utils'

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

  useEffect(() => {
    loadStyleSheet(
      'https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@100;300;400;500&display=swap',
    )
    loadStyleSheet(
      'https://cdn.jsdelivr.net/gh/Innei/zshrc@0.1.1/webfont/OperatorMono.css',
    )
    try {
      const { user } = initialData
      // set user
      master.setUser(user)
      checkLogin()
      client.initIO()
    } finally {
      document.body.classList.remove('loading')
    }

    checkBrowser()
    printToConsole()
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
        request.headers['X-Forwarded-For'] ||
        request.headers['X-Real-IP'] ||
        request.headers['x-real-ip'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress) as string) || undefined
    if (ip && ip.split(',').length > 0) {
      ip = ip.split(',')[0]
    }
    ip && ($axios.defaults.headers.common['x-forwarded-for'] = ip as string)

    $axios.defaults.headers.common[
      'User-Agent'
    ] = `${request.headers['user-agent']} NextJS/v${Package.dependencies.next} Kami/${version}`

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
        $axios.defaults.headers['Authorization'] = `bearer ${token.replace(
          /^Bearer\s/i,
          '',
        )}`
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
      console.error(`Fetch aggregate data error: ${aggregateDataState.reason}`)
    }

    if (configSnippetState.status === 'fulfilled') {
      configSnippet = { ...configSnippetState.value }
    } else {
      configSnippet = defaultConfigs as any
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
      if (ctx.res) {
        ctx.res.statusCode = 466
        ctx.res.statusMessage = 'No Data'
      }
      return null
    }
  })()
  return {
    ...appProps,
    initData: initialData,
  }
}

export default App
