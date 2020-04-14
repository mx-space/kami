import AppStore from './app'
import { Stores } from './types'
import UserStore from './user'

export default function createMobxStores(): Stores {
  return {
    appStore: new AppStore(),
    userStore: new UserStore(),
  }
}
