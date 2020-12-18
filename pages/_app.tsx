// import { animateUriFactory } from 'animate-uri/publish/index.esm'
import { message } from 'utils/message'
import 'assets/styles/main.scss'
import 'normalize.css/normalize.css'
import { InitialContext } from 'common/context/InitialDataContext'
import Loader from 'components/Loader'
import configs from 'configs'
import 'intersection-observer'
import { BasicLayout } from 'layouts/BasicLayout'
import throttle from 'lodash/throttle'

import { AggregateResp } from 'models/aggregate'
import { LogoJsonLd, NextSeo, SocialProfileJsonLd } from 'next-seo'
import App, { AppContext } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import Package from 'package.json'
import React, { FC, useCallback } from 'react'
import useMount from 'react-use/lib/useMount'
import useUnmount from 'react-use/lib/useUnmount'
import { UAParser } from 'ua-parser-js'
import { observer } from 'utils/mobx'
import client from '../common/socket'
import createMobxStores, { useStore } from '../common/store'
import { PageModel } from '../common/store/types'
import { isServerSide } from '../utils'
import { Rest } from '../utils/api'
import { getToken, removeToken } from '../utils/auth'
// import { checkDevtools } from '../utils/forbidden'
import * as gtag from '../utils/gtag'
import service from '../utils/request'
import { enableStaticRendering } from 'mobx-react-lite'
import QP from 'qier-progress'
enableStaticRendering(isServerSide() ? true : false)

const stores = createMobxStores()

const version = process.env.VERSION || `v${Package.version}` || ''

const Progress = new QP()

function printToConsole() {
  try {
    const text = `
    This Blog Powered By Mix Space.
    --------
    Stay hungry. Stay foolish. --Steve Jobs
    `
    document.documentElement.prepend(document.createComment(text))
    console.log(
      '%c Kico Style %c https://paugram.com ',
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #3498db;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )
    console.log(
      `%c Mix Space ${version} %c https://innei.ren `,
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #2980b9;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )
    // eslint-disable-next-line no-empty
  } catch {}
}

let _currentY = 0
const Content: FC<DataModel> = observer((props) => {
  const {
    appStore: app,
    userStore: master,
    categoryStore: category,
    pageStore: pages,
  } = useStore()
  const handleScroll = useCallback(
    throttle(() => {
      const currentY = document.documentElement.scrollTop
      const direction = _currentY >= currentY ? 'up' : 'down'
      app.updatePosition(direction)
      _currentY = currentY
    }, 13),
    [],
  )

  useMount(() => {
    {
      const data = props.initData

      const { seo, user, pageMeta, categories, lastestNoteNid } = data
      // set user
      master.setUser(user)

      document.body.classList.remove('loading')

      // set page
      pages.setPages(pageMeta as PageModel[])
      app.setPage(pageMeta as PageModel[])
      app.setCategories(categories)
      category.setCategory(categories)
      app.setConfig({ seo })
      app.setLastestNoteNid(lastestNoteNid)
    }
    checkLogin()

    if (process.env.NODE_ENV === 'development') {
      ;(window as any).store = stores
    }
    // checkDevtools()

    registerRouterEvents()
    registerEvent()
    checkBrowser()
    printToConsole()

    initColorMode()

    // connect to ws
    client.initIO()
  })
  useUnmount(() => {
    window.onresize = null
    document.removeEventListener('scroll', handleScroll)
  })
  const initColorMode = useCallback(() => {
    const getColormode = <T extends { matches: boolean }>(e: T) => {
      app.colorMode = e.matches ? 'dark' : 'light'
      return app.colorMode
    }
    app.colorMode = getColormode(
      window.matchMedia('(prefers-color-scheme: dark)'),
    )
    try {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          if (app.autoToggleColorMode) {
            getColormode(e)
          }
        })
      // eslint-disable-next-line no-empty
    } catch {}
  }, [])

  const checkBrowser = useCallback(() => {
    const parser = new UAParser(window.navigator.userAgent)
    const browser = parser.getBrowser()
    const isOld: boolean = (() => {
      if (browser.name === 'IE') {
        alert(
          '欧尼酱, 乃真的要使用 IE 浏览器吗, 不如换个 Chrome 好不好嘛（o´ﾟ□ﾟ`o）',
        )
        location.href = 'https://www.google.com/chrome/'
        return true
      }
      // check build-in methods
      const ObjectMethods = ['fromEntries', 'entries']
      const ArrayMethods = ['flat']
      if (
        !window.Reflect ||
        !(
          ObjectMethods.every((m) => Reflect.has(Object, m)) &&
          ArrayMethods.every((m) => Reflect.has(Array.prototype, m))
        ) ||
        !window.requestAnimationFrame ||
        !window.Proxy
      ) {
        return true
      }

      return false
    })()
    if (isOld) {
      message.warn('欧尼酱, 乃的浏览器太老了, 更新一下啦（o´ﾟ□ﾟ`o）')
      class BrowserTooOldError extends Error {
        constructor() {
          const { name: osName, version: osVersion } = parser.getOS()
          super(
            `User browser(${browser.name} ${browser.version}) is too old. OS: ${osName}/${osVersion}`,
          )
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
              master.setLogged(true)
              master.setToken(getToken() as string)
              message.success('欢迎回来, ' + master.name, 1500)
            } else {
              removeToken()
              message.warn('登录身份过期了, 再登录一下吧!', 2)
            }
          })
      }
    })
  }, [])

  const registerRouterEvents = useCallback(() => {
    Router.events.on('routeChangeStart', (url) => {
      // animateInstance?.start(url)
      Progress.start()
    })
    // Router.events.on('beforeHistoryChange', (url) => {
    //   animateInstance?.stop()
    // })
    Router.events.on('routeChangeComplete', () => {
      // window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      Progress.finish()
    })

    Router.events.on('routeChangeError', () => {
      Progress.finish()
      // window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })

      message.error('出现了未知错误, 刷新试试?')
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
      <LogoJsonLd
        logo={new URL('/custom-icon.svg', configs.url).toString()}
        url={configs.url}
      />
      <SocialProfileJsonLd
        type={'Person'}
        name={master.name || ''}
        url={configs.url}
        sameAs={configs.social.map(({ url }) => url)}
      />

      <div id="next">{props.children}</div>
      <Loader />
    </>
  )
})

interface DataModel {
  initData: AggregateResp
}
const app: FC<DataModel & { Component: any; pageProps: any; err: any }> = (
  props,
) => {
  const { initData, Component, pageProps, err } = props
  return (
    <InitialContext.Provider value={initData}>
      <Content initData={initData}>
        <BasicLayout>
          <Component {...pageProps} err={err} />
        </BasicLayout>
      </Content>
    </InitialContext.Provider>
  )
}
let initData: any = null
// cache 5 mins
setInterval(() => {
  initData = null
}, 1000 * 60 * 5)
// @ts-ignore
app.getInitialProps = async (props: AppContext) => {
  const appProps = await App.getInitialProps(props)

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
    service.defaults.headers.common['x-forwarded-for'] = ip

    service.defaults.headers.common['User-Agent'] =
      request.headers['user-agent'] + ' mx-space SSR server' + `/${version}`
    // console.log(service.defaults.headers.common)
  }

  initData = initData || (await Rest('Aggregate').get<AggregateResp>())
  return { ...appProps, initData }
}
export default app
