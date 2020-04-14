import AppStore from './app'
import UserStore from './user'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

export enum LayoutType {
  Post,
  Note,
  Page,
  Home,
}

export interface MenuModel {
  title: string
  type: keyof typeof LayoutType
  _id: string
  path: string
  subMenu?: MenuModel[]
  icon?: IconDefinition
}

export interface Stores {
  appStore: AppStore
  userStore: UserStore
}
