// prettier-ignore-start
import 'windi.css'
import 'assets/styles/main.css'
import '../../third/qp/index.css'

import { observer } from 'mobx-react-lite'
import { NextSeo } from 'next-seo'
import NextApp from 'next/app'
import type { AppContext } from 'next/app'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { memo, useEffect, useMemo } from 'react'

import type { AggregateRoot } from '@mx-space/api-client'

// prettier-ignore-end
import { BasicLayout } from '~/components/layouts/BasicLayout'
import { DebugLayout } from '~/components/layouts/DebugLayout'
import { NoDataErrorView } from '~/components/universal/Error/no-data'
import Loader from '~/components/universal/Loader'
import { MetaFooter } from '~/components/universal/Meta/footer'
import { DynamicHeadMeta } from '~/components/universal/Meta/head'
import type { InitialDataType } from '~/context/initial-data'
import { InitialContextProvider } from '~/context/initial-data'
import { RootStoreProvider } from '~/context/root-store'
import { useRootTrackerListener } from '~/hooks/use-analyze'
import { useCheckLogged } from '~/hooks/use-check-logged'
import { useCheckOldBrowser } from '~/hooks/use-check-old-browser'
import { useInitialData } from '~/hooks/use-initial-data'
import { useResizeScrollEvent } from '~/hooks/use-resize-scroll-event'
import { useRouterEvent } from '~/hooks/use-router-event'
import { useScreenMedia } from '~/hooks/use-screen-media'
import { printToConsole } from '~/utils/console'
import { loadStyleSheet } from '~/utils/load-script'

import { useStore } from '../store'
import { attachRequestProxy, fetchInitialData } from './prepare'

const Content: FC = observer((props) => {
  const { userStore: master } = useStore()

  useScreenMedia()
  const { check: checkBrowser } = useCheckOldBrowser()
  const { check: checkLogin } = useCheckLogged()
  useRouterEvent()
  useResizeScrollEvent()
  useRootTrackerListener()
  const initialData: AggregateRoot | null = useInitialData()

  useEffect(() => {
    loadStyleSheet(
      'https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@100;300;400;500&display=swap',
    )

    try {
      const { user } = initialData
      // set user
      master.setUser(user)
      checkLogin()
      import('../socket/index').then(({ socketClient }) => {
        socketClient.initIO()
      })
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
  if (router.route.startsWith('/dev')) {
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

  attachRequestProxy(request)

  const data = await fetchInitialData()
  const appProps = await (async () => {
    try {
      // Next 会从小组件向上渲染整个页面，有可能在此报错。兜底
      return await NextApp.getInitialProps(props)
    } catch (e) {
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
