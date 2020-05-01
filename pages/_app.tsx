import '@openfonts/noto-sans-sc_vietnamese'
import '@openfonts/noto-serif-sc_vietnamese'
import 'rc-texty/assets/index.css'
import 'antd/es/avatar/style/index.css'
import 'antd/es/comment/style/index.css'
import 'antd/es/input/style/index.css'
import 'antd/es/message/style/index.css'
import 'antd/es/pagination/style/index.css'
import 'kico-style'
import 'kico-style/paul.css'
import 'assets/styles/shizuku.scss'
import 'assets/styles/extra.scss'
import Loader from 'components/Loader'
import configs from 'configs'
import 'intersection-observer'
// import 'antd/dist/antd.dark.css'
// import 'assets/styles/main.scss'
import { BasicLayout } from 'layouts/BasicLayout'
import throttle from 'lodash/throttle'
import makeInspectable from 'mobx-devtools-mst'
import { inject, observer, Provider } from 'mobx-react'
import 'mobx-react-lite/batchingForReactDom'
import { AggregateResp } from 'models/aggregate'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import 'normalize.css/normalize.css'
import React, { createContext, PureComponent } from 'react'
import 'react-image-lightbox/style.css'
import CategoryStore from 'store/category'
import createMobxStores, { StoreProvider } from '../store'
import AppStore from '../store/app'
import PageStore from '../store/pages'
import { PageModel, Stores, ViewportRecord } from '../store/types'
import UserStore from '../store/user'
import { Rest } from '../utils/api'
import * as gtag from '../utils/gtag'

const stores = createMobxStores()

makeInspectable(stores)

const AppContext = createContext({
  viewport: {},
})

@inject((store: Stores) => ({
  master: store.userStore,
  pages: store.pageStore,
  app: store.appStore,
  category: store.categoryStore,
}))
@observer
class Context extends PureComponent<Store & { data: any }> {
  scrollCb = throttle(() => {
    this.props.app?.updatePosition()
    document.body.style.backgroundPositionY = `${
      document.documentElement.scrollTop / 36
    }px`
  }, 8)

  componentDidMount(): void {
    // get aggregate data
    Rest('Aggregate')
      .get<AggregateResp>()
      .then((res) => {
        const { seo, user, pageMeta, categories } = res
        // set user
        this.props.master?.setUser(user)
        // set page
        this.props.pages?.setPages(pageMeta as PageModel[])
        this.props.app?.setPage(pageMeta as PageModel[])
        this.props.app?.setCategories(categories)
        this.props.category?.setCategory(categories)
        this.props.app?.setConfig({ seo })
      })

    if (process.env.NODE_ENV === 'development') {
      ;(window as any).store = stores
    }

    Router.events.on('routeChangeStart', () => {
      this.props.app?.setLoading(true)
    })

    Router.events.on('routeChangeComplete', () => {
      // window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      this.props.app?.setLoading(false)
    })

    Router.events.on('routeChangeError', () => {
      // window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      this.props.app?.setLoading(false)
    })

    Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))

    window.onresize = (e) => this.props.app?.UpdateViewport()
    this.props.app?.UpdateViewport()

    if (typeof document !== 'undefined') {
      document.addEventListener('scroll', this.scrollCb)
    }

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
            title={this.props.app?.title || configs.title}
            description={this.props.app?.description || configs.description}
          />
          {this.props.children}
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
