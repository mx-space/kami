import AppStore from './app'
import { Stores } from './types'
import UserStore from './user'
import SocialStore from './social'
import PageStore from './pages'
import CategoryStore from './category'
import { createContext, useContext } from 'react'
import MusicStore from './music'
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
