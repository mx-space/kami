import 'windi.css'
import 'assets/styles/main.css'

import type { AppContext } from 'next/app'
import NextApp from 'next/app'
import { NextIntlClientProvider } from 'next-intl'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { startTransition, useEffect, useMemo } from 'react'

import { defaultLocale } from '~/i18n/config'
import { getLocaleFromContext } from '~/i18n/navigation'

import { ProviderComposer } from '~/components/app/Composer'
import { NoDataErrorView } from '~/components/app/Error/no-data'
import { AppLayout } from '~/components/layouts/AppLayout'
import { DebugLayout } from '~/components/layouts/DebugLayout'
import { SiteLayout } from '~/components/layouts/SiteLayout'
import type { InitialDataType } from '~/provider/initial-data'
import { InitialContextProvider } from '~/provider/initial-data'
import { LangSyncProvider } from '~/provider/lang-sync'
import { SWRProvider } from '~/provider/swr'
import { setRequestLocale } from '~/utils/client'
import { attachRequestProxy, fetchInitialData } from '~/utils/app'
import { isDev } from '~/utils/env'

import '../../third/qp/index.css'

import type { AggregateRoot } from '@mx-space/api-client'

import { useUserStore } from '~/atoms/user'
import { useCheckLogged } from '~/hooks/app/use-check-logged'
import { useCheckOldBrowser } from '~/hooks/app/use-check-old-browser'
import { useInitialData } from '~/hooks/app/use-initial-data'
import { ToastContainer } from '~/provider/toastify'
import { printToConsole } from '~/utils/console'

interface DataModel {
  initData: InitialDataType
  locale?: string
  messages?: Record<string, unknown>
}

const PageProviders = [
  <SWRProvider key="SWRProvider" />,
  <LangSyncProvider key="LangSyncProvider" />,
  <AppLayout key="appLayout" />,
  <SiteLayout key="BasicLayout" />,
]

const Prepare = () => {
  const { check: checkBrowser } = useCheckOldBrowser()
  const { check: checkLogin } = useCheckLogged()
  const initialData: AggregateRoot | null = useInitialData()

  useEffect(() => {
    startTransition(() => {
      try {
        const { user } = initialData
        checkLogin()
        useUserStore.getState().setUser(user)
        import('../socket').then(({ socketClient }) => {
          socketClient.initIO()
        })
      } finally {
        document.body.classList.remove('loading')
      }
      checkBrowser()
      printToConsole()
    })
  }, [])
  return null
}
const App: FC<DataModel & { Component: any; pageProps: any; err: any }> = (
  props,
) => {
  const { initData, Component, pageProps, locale = defaultLocale, messages = {} } = props

  const router = useRouter()

  const AppProviders = useMemo(
    () => [
      <InitialContextProvider value={initData} key="InitialContextProvider" />,
    ],
    [initData],
  )

  const Inner = useMemo(() => {
    // 兜底页
    return initData.aggregateData ? (
      <ProviderComposer contexts={PageProviders}>
        <Component {...pageProps} />
        <ToastContainer key="ToastContainer" />
      </ProviderComposer>
    ) : (
      <NoDataErrorView />
    )
  }, [Component, initData.aggregateData, pageProps])
  if (router.route.startsWith('/dev') && isDev) {
    return (
      <DebugLayout>
        <Component {...pageProps} />
      </DebugLayout>
    )
  }
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ProviderComposer contexts={AppProviders}>
        <Prepare />
        {Inner}
      </ProviderComposer>
    </NextIntlClientProvider>
  )
}
// @ts-ignore
App.getInitialProps = async (props: AppContext) => {
  const ctx = props.ctx
  const request = ctx.req

  attachRequestProxy(request)

  const locale = getLocaleFromContext(ctx)
  setRequestLocale(locale)
  const data: InitialDataType & { reason?: any } = await fetchInitialData()

  const messages = (
    await import(`../messages/${locale}.json`)
  ).default as Record<string, unknown>

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
    locale,
    messages,
  }
}

export default App
