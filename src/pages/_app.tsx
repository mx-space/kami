// prettier-ignore-start
import 'windi.css'
import 'assets/styles/main.css'
import '../../third/qp/index.css'

import NextApp from 'next/app'
import type { AppContext } from 'next/app'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { memo, useMemo, useRef } from 'react'
import type { ToastContainerProps } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
// prettier-ignore-end
import { SWRConfig } from 'swr'
import type { FullConfiguration } from 'swr/_internal'

import { NoDataErrorView } from '~/components/app/Error/no-data'
import { BasicLayout } from '~/components/layouts/BasicLayout'
import { DebugLayout } from '~/components/layouts/DebugLayout'
import type { InitialDataType } from '~/context/initial-data'
import { InitialContextProvider } from '~/context/initial-data'
import { RootStoreProvider } from '~/context/root-store'
import { isDev } from '~/utils/env'
import { localStorageProvider } from '~/utils/swr'

import { Content } from '../components/layouts/AppLayout'
import { attachRequestProxy, fetchInitialData } from '../utils/app'

interface DataModel {
  initData: InitialDataType
}
const App: FC<DataModel & { Component: any; pageProps: any; err: any }> = (
  props,
) => {
  const { initData, Component, pageProps } = props

  const router = useRouter()

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
  if (router.route.startsWith('/dev') && isDev) {
    return (
      <RootStoreProvider>
        <DebugLayout>
          <Component {...pageProps} />
        </DebugLayout>
      </RootStoreProvider>
    )
  }
  return (
    <RootStoreProvider>
      <InitialContextProvider value={initData}>{Inner}</InitialContextProvider>
    </RootStoreProvider>
  )
}
const Wrapper = memo((props) => {
  const toastOptions = useRef<ToastContainerProps>({
    autoClose: 3000,
    pauseOnHover: true,
    hideProgressBar: true,
    newestOnTop: true,
    closeOnClick: true,
    closeButton: false,
    toastClassName: () => '',
    bodyClassName: () => '',
  })
  const swrConfig = useRef<
    Partial<FullConfiguration> & {
      provider?: any
    }
  >({
    refreshInterval: 30_000,
    provider: localStorageProvider,
  })
  return (
    <>
      <SWRConfig value={swrConfig.current}>
        <BasicLayout>
          <Content>{props.children}</Content>
        </BasicLayout>
      </SWRConfig>

      <ToastContainer {...toastOptions.current} />
    </>
  )
})
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
      // 只有无数据 也就是 服务端不跑起来 或者接口不对的时候 捕获异常
      // 这是为什么呢 说来说去还是 nextjs 太辣鸡了 只能各种 hack
      // 只能这样了

      if (!data.reason) {
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
    initData: data,
  }
}

export default App
