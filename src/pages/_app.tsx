import 'windi.css'
import 'assets/styles/main.css'
import '../../third/qp/index.css'

import type { AppContext } from 'next/app'
import NextApp from 'next/app'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useMemo } from 'react'

import { ProviderComposer } from '~/components/app/Composer'
import { NoDataErrorView } from '~/components/app/Error/no-data'
import { ErrorBoundary } from '~/components/app/ErrorBoundary'
import { BasicLayout } from '~/components/layouts/BasicLayout'
import { DebugLayout } from '~/components/layouts/DebugLayout'
import type { InitialDataType } from '~/provider/initial-data'
import { InitialContextProvider } from '~/provider/initial-data'
import { RootStoreProvider } from '~/provider/root-store'
import { SWRProvider } from '~/provider/swr'
import { isDev } from '~/utils/env'

import { AppLayout } from '../components/layouts/AppLayout'
import { attachRequestProxy, fetchInitialData } from '../utils/app'

interface DataModel {
  initData: InitialDataType
}
const App: FC<DataModel & { Component: any; pageProps: any; err: any }> = (
  props,
) => {
  const { initData, Component, pageProps } = props

  const router = useRouter()

  const PageProviders = useMemo(
    () => [
      <SWRProvider key="SWRProvider" />,
      <ErrorBoundary key="ErrorBoundary1" />,
      <BasicLayout key="BasicLayout" />,
      <AppLayout key="appLayout" />,
      <ErrorBoundary key="ErrorBoundary2" />,
    ],
    [],
  )

  const AppProviders = useMemo(
    () => [
      <RootStoreProvider key="RootStoreProvider" />,
      <InitialContextProvider value={initData} key="InitialContextProvider" />,
    ],
    [initData],
  )

  const Inner = useMemo(() => {
    // 兜底页
    return initData.aggregateData ? (
      <ProviderComposer contexts={PageProviders}>
        <Component {...pageProps} />
      </ProviderComposer>
    ) : (
      <NoDataErrorView />
    )
  }, [Component, initData.aggregateData, pageProps])
  if (router.route.startsWith('/dev') && isDev) {
    return (
      <RootStoreProvider>
        <DebugLayout>
          <Component {...pageProps} />
        </DebugLayout>
      </RootStoreProvider>
    )
  }
  return <ProviderComposer contexts={AppProviders}>{Inner}</ProviderComposer>
}
// @ts-ignore
App.getInitialProps = async (props: AppContext) => {
  const ctx = props.ctx
  const request = ctx.req

  attachRequestProxy(request)

  const data: InitialDataType & { reason?: any } = await fetchInitialData()
  const appProps = await (async () => {
    try {
      // Next 会从小组件向上渲染整个页面，有可能在此报错。兜底
      return await NextApp.getInitialProps(props)
    } catch (e) {
      // TODO next rfc Layout, 出了就重构这里
      // 2023 tmd next rfc 全是大饼，根本没法用
      // 只有无数据 也就是 服务端不跑起来 或者接口不对的时候 捕获异常
      // 这是为什么呢 说来说去还是 nextjs 太辣鸡了 只能各种 hack
      // 只能这样了

      if (!data.reason) {
        // 这里抛出，和官网直接 await getProps 一样，异常走到 _error 处理
        throw e
      }
      // 这里捕获，为了走全局无数据页
      if (ctx.res) {
        ctx.res.statusCode = 466
        ctx.res.statusMessage = 'No Data'
      }
      return null
    }
  })()
  return {
    ...appProps,
    initData: data,
  }
}

export default App
