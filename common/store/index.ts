/*
 * @Author: Innei
 * @Date: 2020-04-29 17:27:02
 * @LastEditTime: 2021-01-14 13:21:23
 * @LastEditors: Innei
 * @FilePath: /web/common/store/index.ts
 * @Copyright
 */

import { createContext, useContext } from 'react'
import AppStore from './app'
import CategoryStore from './category'
import MusicStore from './music'
import PageStore from './pages'

import UserStore from './user'
import GatewayStore from './gateway'
import ActionStore from './action'
import { isClientSide, isServerSide } from 'utils'
import { enableStaticRendering } from 'mobx-react-lite'
import { configure } from 'mobx'

configure({
  useProxies: 'always',
})

enableStaticRendering(isServerSide())

export const gatewayStore = new GatewayStore()
export const userStore = new UserStore()
export const appStore = new AppStore()

export const categoryStore = new CategoryStore()

export const pageStore = new PageStore()
export const musicStore = new MusicStore()

export const actionStore = new ActionStore()
export const stores = {
  appStore,
  userStore,
  pageStore,
  categoryStore,
  musicStore,
  gatewayStore,
  actionStore,
}
if (process.env.NODE_ENV === 'development' && isClientSide()) {
  ;(window as any).store = stores
}

export const StoreContext = createContext(stores)

export const useStore = () => useContext(StoreContext)
