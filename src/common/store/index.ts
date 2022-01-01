import { configure } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, useContext } from 'react'
import { isClientSide, isServerSide } from 'utils'
import ActionStore from './action'
import AppUIStore from './app'
import GatewayStore from './gateway'
import MusicStore from './music'
import UserStore from './user'

configure({
  useProxies: 'always',
})

enableStaticRendering(isServerSide())

export const gatewayStore = new GatewayStore()
export const userStore = new UserStore()
export const appUIStore = new AppUIStore()

export const musicStore = new MusicStore()

export const actionStore = new ActionStore()
export const stores = {
  appStore: appUIStore,
  userStore,

  musicStore,
  gatewayStore,
  actionStore,
}
if (process.env.NODE_ENV === 'development' && isClientSide()) {
  ;(window as any).store = stores
}

export const StoreContext = createContext(stores)

export const useStore = () => useContext(StoreContext)