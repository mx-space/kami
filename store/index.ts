import { createContext, useContext } from 'react'
import AppStore from './app'
import CategoryStore from './category'
import MusicStore from './music'
import PageStore from './pages'
import SocialStore from './social'
import { Stores } from './types'
import UserStore from './user'
export default function createMobxStores(): Stores {
  return {
    appStore: new AppStore(),
    userStore: new UserStore(),
    socialStore: new SocialStore(),
    pageStore: new PageStore(),
    categoryStore: new CategoryStore(),
    musicStore: new MusicStore(),
  }
}

export const StoreContext = createContext<Stores>({} as Stores)
export const StoreProvider = StoreContext.Provider
export const useStore = (): Stores => useContext(StoreContext)
