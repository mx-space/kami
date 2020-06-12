import '@openfonts/noto-sans-sc_vietnamese'
import 'antd/es/avatar/style/index.css'
import 'antd/es/button/style/index.css'
import 'antd/es/comment/style/index.css'
import 'antd/es/input/style/index.css'
import 'antd/es/message/style/index.css'
import 'antd/es/pagination/style/index.css'
import 'antd/es/popover/style/index.css'
import 'kico-style'
import 'kico-style/paul.css'
import 'assets/styles/shizuku.scss'
import 'assets/styles/extra.scss'
import 'rc-texty/assets/index.css'
import 'react-image-lightbox/style.css'
import 'normalize.css/normalize.css'

import 'intersection-observer'

import Loader from 'components/Loader'
import configs from 'configs'
import { BasicLayout } from 'layouts/BasicLayout'
import throttle from 'lodash/throttle'
import makeInspectable from 'mobx-devtools-mst'
import { inject, observer, Provider } from 'mobx-react'
import 'mobx-react-lite/batchingForReactDom'
import { AggregateResp } from 'models/aggregate'
import { NextSeo } from 'next-seo'
import Router from 'next/router'

import React, { createContext, PureComponent } from 'react'

import CategoryStore from 'store/category'
import client from '../socket'
import createMobxStores, { StoreProvider } from '../store'
import AppStore from '../store/app'
import PageStore from '../store/pages'
import { PageModel, Stores, ViewportRecord } from '../store/types'
import UserStore from '../store/user'
import { Rest } from '../utils/api'
import { getToken, removeToken } from '../utils/auth'
import { AntiDebug } from '../utils/forbidden'
import * as gtag from '../utils/gtag'
import { getBrowserType } from '../utils/ua'
import { message } from 'antd'

const stores = createMobxStores()
if (process.env.NODE_ENV === 'development') {
  makeInspectable(stores)
}

const AppContext = createContext({
  viewport: {},
})

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
  scrollCb = throttle(() => {
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
        })
        .then(() => {
          if (getToken()) {
            Rest('Master', 'check_logged')
              .get<any>()
              .then(({ ok }) => {
                if (ok) {
                  this.props.user?.setLogged(true)
                  this.props.user?.setToken(getToken() as string)
                  message.success('欢迎回来, ' + this.props.master?.name)
                } else {
                  removeToken()
                  message.warn('登陆身份过期了, 再登陆一下吧!')
                }
              })
          }
        })

      if (process.env.NODE_ENV === 'development') {
        ;(window as any).store = stores
      }

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

      window.onresize = (e) => this.props.app?.UpdateViewport()
      this.props.app?.UpdateViewport()

      if (typeof document !== 'undefined') {
        document.addEventListener('scroll', this.scrollCb)
      }

      const browser = getBrowserType(window.navigator.userAgent)
      if (browser === 'ie') {
        alert('哥哥, 换个 Chrome 再来吧')
        location.href = 'https://www.google.com/chrome/'
      }
      // anti debug
      if (process.env.NODE_ENV !== 'development') {
        AntiDebug.cyclingDebugger() as any

        AntiDebug.checkDebug(() => console.log('请不要打开调试')) as any
      }

      this.printToConsole()
      let prompt = true
      window.addEventListener('beforeinstallprompt', (e: any) => {
        e.preventDefault()
        if (prompt) {
          e.prompt()
          prompt = false
        }
      })
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
          // safari not support this lister please catch it
          .addListener((e) => {
            if (this.props.app?.autoToggleColorMode) {
              getColormode(e)
            }
          })
        // eslint-disable-next-line no-empty
      } catch {}

      // connect to ws
      client.initIO()

      this.setState({
        loading: false,
      })
      this.props.app?.setLoading(false)
    }
  }

  printToConsole() {
    console.log(
      '%c Kico Style %c https://paugram.com ',
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #3498db;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )
    console.log(
      '%c Mix Space %c https://innei.ren ',
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #2980b9;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )
  }
  componentWillUnmount() {
    window.onresize = null
    document.removeEventListener('scroll', this.scrollCb)
  }

  render() {
    return (
      <AppContext.Provider
        value={{ viewport: this.props.app?.viewport as ViewportRecord }}
      >
        <StoreProvider value={stores}>
          <NextSeo
            title={
              (this.props.app?.title || configs.title) +
              ' · ' +
              (this.props.app?.description || configs.description)
            }
            description={this.props.app?.description || configs.description}
          />
          <div id="next" style={{ display: this.state.loading ? 'none' : '' }}>
            {this.props.children}
          </div>
          <Loader />
        </StoreProvider>
      </AppContext.Provider>
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
class App extends React.Component<
  DataModel & { Component: any; pageProps: any }
> {
  render() {
    const { Component, pageProps, pageData } = this.props
    return (
      <Provider {...stores}>
        <Context data={{ pages: pageData }}>
          <BasicLayout>
            <Component {...pageProps} />
          </BasicLayout>
        </Context>
      </Provider>
    )
  }
}

export default App
