import Header from 'components/Header'
import 'kico-style'
import 'kico-style/paul.css'
import makeInspectable from 'mobx-devtools-mst'
import { inject, observer, Provider } from 'mobx-react'
import 'normalize.css/normalize.css'
import React, { PureComponent } from 'react'
import { PagesPagerRespDto } from '../models/dto/page'
import createMobxStores from '../store'
import AppStore from '../store/app'
import PageStore from '../store/pages'
import { PageModel, Stores } from '../store/types'
import UserStore from '../store/user'
import { Rest } from '../utils/api'

const stores = createMobxStores()

makeInspectable(stores)
const BasicLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
@inject((store: Stores) => ({
  master: store.userStore,
  pages: store.pageStore,
  app: store.appStore,
}))
@observer
class Context extends PureComponent<Store & { data: any }> {
  componentDidMount(): void {
    this.props.master?.fetchUser()
    Rest('Page')
      .gets<PagesPagerRespDto>()
      .then(({ data }) => {
        this.props.app?.setPage(data || [])
      })
  }

  render() {
    return <>{this.props.children}</>
  }
}

interface Store {
  master?: UserStore
  pages?: PageStore
  app?: AppStore
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
