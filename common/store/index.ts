/*
 * @Author: Innei
 * @Date: 2020-04-29 17:27:02
 * @LastEditTime: 2020-08-16 20:40:06
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/store/index.ts
 * @Copyright
 */

import { createContext, useContext } from 'react'
import AppStore from './app'
import CategoryStore from './category'
import MusicStore from './music'
import PageStore from './pages'
import SocialStore from './social'
import { Stores } from './types'
import UserStore from './user'
import GatewayStore from './gateway'
import ActionStore from './action'
export const gatewayStore = new GatewayStore()
export const userStore = new UserStore()
export default function createMobxStores(): Stores {
  return {
    appStore: new AppStore(),
    userStore,
    socialStore: new SocialStore(),
    pageStore: new PageStore(),
    categoryStore: new CategoryStore(),
    musicStore: new MusicStore(),
    gatewayStore,
    actionStore: new ActionStore(),
  }
}

export const StoreContext = createContext<Stores>(createMobxStores())
export const StoreProvider = StoreContext.Provider
export const useStore = (): Stores => useContext(StoreContext)
