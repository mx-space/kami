import '@openfonts/noto-sans-sc_vietnamese'
import 'antd/es/button/style/index.css'
import 'antd/es/comment/style/index.css'
import 'antd/es/input/style/index.css'
import 'antd/es/message/style/index.css'

import 'antd/es/popover/style/index.css'
import 'kico-style'
import 'kico-style/paul.css'
import 'assets/styles/shizuku.scss'
import 'assets/styles/extra.scss'
import 'rc-texty/assets/index.css'

import 'normalize.css/normalize.css'

import 'intersection-observer'

import Loader from 'components/Loader'
import configs from 'configs'
import { BasicLayout } from 'layouts/BasicLayout'
import throttle from 'lodash/throttle'

import { inject, observer, Provider } from 'mobx-react'
import 'mobx-react-lite/batchingForReactDom'
import { AggregateResp } from 'models/aggregate'

import Router from 'next/router'

import React, { PureComponent, FC } from 'react'

import CategoryStore from 'common/store/category'
import client from '../common/socket'
import createMobxStores, { StoreProvider } from '../common/store'
import AppStore from '../common/store/app'
import PageStore from '../common/store/pages'
import { PageModel, Stores } from '../common/store/types'
import UserStore from '../common/store/user'
import { Rest } from '../utils/api'
import { getToken, removeToken } from '../utils/auth'
// import { checkDevtools } from '../utils/forbidden'
import * as gtag from '../utils/gtag'

import { message } from 'antd'
import App, { AppContext } from 'next/app'
import { LogoJsonLd, SocialProfileJsonLd, NextSeo } from 'next-seo'
import Package from 'package.json'
import service from '../utils/request'
import { isServerSide } from '../utils'

import * as Sentry from '@sentry/node'
import { UAParser } from 'ua-parser-js'
import Head from 'next/head'

if (process.env.CI !== 'true') {
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  })
}

const stores = createMobxStores()

const version = process.env.VERSION || `v${Package.version}` || ''

@inject((store: Stores) => ({
  master: store.userStore,
  pages: store.pageStore,
  app: store.appStore,
  category: store.categoryStore,
  user: store.userStore,
}))
@observer
class Context extends PureComponent<Store & { data: any }> {
  currentY = 0
  handleScroll = throttle(() => {
    const currentY = document.documentElement.scrollTop
    const direction = this.currentY >= currentY ? 'up' : 'down'
    this.props.app?.updatePosition(direction)
    this.currentY = currentY
  }, 13)
  state = {
    loading: true,
  }
  componentDidMount(): void {
    if (typeof window !== 'undefined') {
      // get aggregate data
      this.fetchData()

      if (process.env.NODE_ENV === 'development') {
        ;(window as any).store = stores
      }
      // checkDevtools()

      this.registerRouterEvents()
      this.registerEvent()
      this.checkBrowser()
      this.printToConsole()
      this.pwaPopup()

      this.initColorMode()

      // connect to ws
      client.initIO()
    }
  }

  private initColorMode() {
    const getColormode = <T extends { matches: boolean }>(e: T) => {
      this.props.app!.colorMode = e.matches ? 'dark' : 'light'
      return this.props.app!.colorMode
    }
    this.props.app!.colorMode = getColormode(
      window.matchMedia('(prefers-color-scheme: dark)'),
    )
    try {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          if (this.props.app?.autoToggleColorMode) {
            getColormode(e)
          }
        })
      // window
      //   .matchMedia('(prefers-color-scheme: dark)')
      //   // safari not support this lister please catch it
      //   .addListener((e) => {
      //     if (this.props.app?.autoToggleColorMode) {
      //       getColormode(e)
      //     }
      //   })
    } catch {
      // eslint-disable-next-line no-empty
    }
  }

  private pwaPopup() {
    // let prompt = true
    // window.addEventListener('beforeinstallprompt', (e: any) => {
    //   e.preventDefault()
    //   if (prompt) {
    //     e.prompt()
    //     prompt = false
    //   }
    // })
  }

  private checkBrowser() {
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
  }

  private registerEvent() {
    const resizeHandler = throttle(() => {
      this.props.app?.updateViewport()
    }, 300)
    window.onresize = resizeHandler
    this.props.app?.updateViewport()

    if (typeof document !== 'undefined') {
      document.addEventListener('scroll', this.handleScroll)
    }
  }

  private fetchData() {
    Rest('Aggregate')
      .get<AggregateResp>()
      .then((res) => {
        const { seo, user, pageMeta, categories, lastestNoteNid } = res
        // set user
        this.props.master?.setUser(user)
        // set page
        this.props.pages?.setPages(pageMeta as PageModel[])
        this.props.app?.setPage(pageMeta as PageModel[])
        this.props.app?.setCategories(categories)
        this.props.category?.setCategory(categories)
        this.props.app?.setConfig({ seo })
        this.props.app?.setLastestNoteNid(lastestNoteNid)

        this.setState({
          loading: false,
        })
        this.props.app?.setLoading(false)
      })
      .then(() => {
        if (getToken()) {
          Rest('Master', 'check_logged')
            .get<any>()
            .then(({ ok }) => {
              if (ok) {
                this.props.user?.setLogged(true)
                this.props.user?.setToken(getToken() as string)
                message.success('欢迎回来, ' + this.props.master?.name, 1.5)
              } else {
                removeToken()
                message.warn('登陆身份过期了, 再登陆一下吧!', 2)
              }
            })
        }
      })
  }

  private registerRouterEvents() {
    Router.events.on('routeChangeStart', () => {
      setTimeout(() => {
        if (this.props.app?.loading) {
          this.setState({ loading: true })
        }
      }, 500)
      this.props.app?.setLoading(true)
    })

    Router.events.on('routeChangeComplete', () => {
      // window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      this.setState({ loading: false })
      this.props.app?.setLoading(false)
    })

    Router.events.on('routeChangeError', () => {
      // window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      this.setState({ loading: false })
      this.props.app?.setLoading(false)
      message.error('出现了未知错误, 刷新试试?')
    })

    Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))
  }

  printToConsole() {
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
  componentWillUnmount() {
    window.onresize = null
    document.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <StoreProvider value={stores}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <NextSeo
          title={
            (this.props.app?.title || configs.title) +
            ' · ' +
            (this.props.app?.description || configs.description)
          }
          description={this.props.app?.description || configs.description}
        />
        <LogoJsonLd
          logo={new URL('/custom-icon.svg', configs.url).toString()}
          url={configs.url}
        />
        <SocialProfileJsonLd
          type={'Person'}
          name={configs.author}
          url={configs.url}
          sameAs={configs.social.map(({ url }) => url)}
        />

        <div id="next" style={{ display: this.state.loading ? 'none' : '' }}>
          {this.props.children}
        </div>
        <Loader />
      </StoreProvider>
    )
  }
}

interface Store {
  master?: UserStore
  pages?: PageStore
  app?: AppStore
  category?: CategoryStore
  user?: UserStore
}
interface DataModel {
  pageData: PageModel[]
}
const app: FC<DataModel & { Component: any; pageProps: any; err: any }> = (
  props,
) => {
  const { Component, pageProps, pageData, err } = props
  return (
    <Provider {...stores}>
      <Context data={{ pages: pageData }}>
        <BasicLayout>
          <Component {...pageProps} err={err} />
        </BasicLayout>
      </Context>
    </Provider>
  )
}
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
      request.headers['user-agent'] + ' mx-space render server' + `/${version}`
    // console.log(service.defaults.headers.common)
  }

  return { ...appProps }
}
export default app
