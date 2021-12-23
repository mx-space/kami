// organize-imports-ignore
import 'windi.css'
// organize-imports-ignore
import 'assets/styles/main.scss'
// organize-imports-ignore
import 'normalize.css/normalize.css'

import { DropdownProvider } from 'common/context/dropdown'
import { InitialContext } from 'common/context/InitialDataContext'
import Loader from 'components/Loader'
import { BasicLayout } from 'layouts/BasicLayout'
import throttle from 'lodash/throttle'
import { AggregateResp } from 'models/aggregate'
import { NextSeo } from 'next-seo'
import NextApp, { AppContext } from 'next/app'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'

import QP from 'qier-progress'
import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import useMount from 'react-use/lib/useMount'
import useUnmount from 'react-use/lib/useUnmount'
import { checkOldBrowser } from 'utils'
import { devtoolForbidden, printToConsole } from 'utils/console'
import { message } from 'utils/message'
import { observer } from 'utils/mobx'

import Package from '~/package.json'
import client from '../common/socket'
import { useStore } from '../common/store'
import { PageModel } from '../common/store/types'
import { isServerSide } from '../utils'
import { Rest } from '../utils/api'
import { getToken, removeToken } from '../utils/cookie'
import * as gtag from '../utils/gtag'
import service from '../utils/request'

const version = `v${Package.version}` || ''

const Progress = new QP({ colorful: false, color: '#27ae60' })

if (isServerSide()) {
  React.useLayoutEffect = useEffect
}

const Content: FC<DataModel> = observer((props) => {
  const _currentY = useRef(0)
  const {
    appStore: app,
    userStore: master,
    categoryStore: category,
  } = useStore()

  const handleScroll = throttle(
    () => {
      const currentY = document.documentElement.scrollTop
      const direction = _currentY.current > currentY ? 'up' : 'down'
      app.updatePosition(direction)
      _currentY.current = currentY
    },
    50,
    { leading: true },
  )

  useMount(() => {
    {
      const data = props.initData

      const { seo, user, pageMeta, categories, lastestNoteNid } = data
      // set user
      master.setUser(user)

      document.body.classList.remove('loading')

      // set page
      app.setPage(pageMeta as PageModel[])

      category.setCategory(categories)
      app.setConfig({ seo })
      app.setLastestNoteNid(lastestNoteNid)
    }
    checkLogin()

    registerRouterEvents()
    registerEvent()
    checkBrowser()
    printToConsole()

    // connect to ws
    client.initIO()
  })
  useUnmount(() => {
    window.onresize = null
    document.removeEventListener('scroll', handleScroll)
  })

  // initMediaListener
  useEffect(() => {
    const getColormode = <T extends { matches: boolean }>(e: T) => {
      app.colorMode = e.matches ? 'dark' : 'light'
      return app.colorMode
    }

    const getMediaType = <T extends { matches: boolean }>(e: T) => {
      app.mediaType = e.matches ? 'screen' : 'print'
      return app.mediaType
    }
    getColormode(window.matchMedia('(prefers-color-scheme: dark)'))
    getMediaType(window.matchMedia('screen'))
    const cb1 = (e: MediaQueryListEvent): void => {
      if (app.autoToggleColorMode) {
        getColormode(e)
      }
    }
    const cb2 = (e: MediaQueryListEvent): void => {
      getMediaType(e)
    }
    try {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', cb1)

      window.matchMedia('screen').addEventListener('change', cb2)
      // eslint-disable-next-line no-empty
    } catch {}

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', cb1)
      window.matchMedia('screen').removeEventListener('change', cb2)
    }
  }, [])

  const checkBrowser = useCallback(() => {
    const { isOld, msg: errMsg } = checkOldBrowser()
    if (isOld) {
      const msg = '欧尼酱, 乃的浏览器太老了, 更新一下啦（o´ﾟ□ﾟ`o）'
      alert(msg)
      message.warn(msg, Infinity)
      class BrowserTooOldError extends Error {
        constructor() {
          super(errMsg)
        }
      }

      throw new BrowserTooOldError()
    }
  }, [])

  const registerEvent = useCallback(() => {
    const resizeHandler = throttle(() => {
      app.updateViewport()
    }, 300)
    window.onresize = resizeHandler
    app.updateViewport()

    if (typeof document !== 'undefined') {
      document.addEventListener('scroll', handleScroll)
    }
  }, [])

  const checkLogin = useCallback(() => {
    requestAnimationFrame(() => {
      if (getToken()) {
        Rest('Master', 'check_logged')
          .get<any>()
          .then(({ ok }) => {
            if (ok) {
              master.setToken(getToken() as string)
              message.success('欢迎回来, ' + master.name, 1500)
            } else {
              removeToken()
              message.warn('登录身份过期了, 再登录一下吧!', 2)
            }
          })
      } else {
        devtoolForbidden()
      }
    })
  }, [])

  const registerRouterEvents = useCallback(() => {
    // const getMainWrapper = () => {
    //   const $main = document.querySelector('main')

    //   if (!$main) {
    //     return null
    //   }
    //   return $main
    // }

    // let animate: Animation | null = null

    // const animation = (status: 'in' | 'out') => {
    //   const $main = getMainWrapper()
    //   if ($main) {
    //     status === 'out'
    //       ? $main.classList.add('loading')
    //       : $main.classList.remove('loading')
    //   }
    // }

    Router.events.on('routeChangeStart', () => {
      // animation('out')

      Progress.start()
      history.backPath = history.backPath
        ? [...history.backPath, history.state.as]
        : [history.state.as]
    })

    Router.events.on('routeChangeComplete', () => {
      // animation('in')

      Progress.finish()
    })

    Router.events.on('routeChangeError', () => {
      // animation('in')
      history.backPath?.pop()
      Progress.finish()
      // message.error('出现了未知错误, 刷新试试?')
    })

    Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))
  }, [])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.initData.seo.keywords && (
          <meta
            name="keywords"
            content={props.initData.seo.keywords.join(',')}
          />
        )}
      </Head>
      <NextSeo
        title={
          props.initData.seo.title + ' · ' + props.initData.seo.description
        }
        description={props.initData.seo.description}
      />

      {/* <button
        style={{ position: 'fixed', zIndex: 3e10 }}
        onClick={() => {
          document.body.classList.toggle('loading')
        }}
      >
        toggle
      </button> */}
      <div id="next">{props.children}</div>
      <Loader />
    </>
  )
})

interface DataModel {
  initData: AggregateResp
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
    <InitialContext.Provider value={initData}>
      <DropdownProvider>
        <Content initData={initData}>{Comp}</Content>
      </DropdownProvider>
    </InitialContext.Provider>
  )
}
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
    service.defaults.headers.common['x-forwarded-for'] = ip as string

    service.defaults.headers.common['User-Agent'] =
      request.headers['user-agent'] + ' mx-space SSR server' + `/${version}`
    // console.log(service.defaults.headers.common)
  }

  initData = initData || (await Rest('Aggregate').get<AggregateResp>())

  return { ...appProps, initData }
}
export default App
