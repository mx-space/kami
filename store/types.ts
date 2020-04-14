import AppStore from './app'
import UserStore from './user'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import SocialStore from './social'

export enum LayoutType {
  Post,
  Note,
  Page,
  Home,
  Project,
  Music,
  Bangumi,
  Custom,
}

export interface MenuModel {
  title: string
  type: keyof typeof LayoutType
  _id: string
  path: string
  subMenu?: MenuModel[]
  icon?: IconDefinition
}

export interface SocialLinkModel {
  icon: IconDefinition
  title?: string
  url: string
}

export interface Stores {
  appStore: AppStore
  userStore: UserStore
  socialStore: SocialStore
}
