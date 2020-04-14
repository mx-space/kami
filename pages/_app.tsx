import 'normalize.css/normalize.css'
import React from 'react'
import Header from 'components/Header'
import { Provider } from 'mobx-react'
import 'kico-style'
import 'kico-style/paul.css'
import makeInspectable from 'mobx-devtools-mst'
import createMobxStores from '../store'

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

export default function App({ Component, pageProps }) {
  return (
    <Provider {...stores}>
      <BasicLayout>
        <Component {...pageProps} />
      </BasicLayout>
    </Provider>
  )
}
