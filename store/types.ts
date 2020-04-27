import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { PageDescriptionDto } from '../models/dto/page'
import AppStore from './app'
import CategoryStore from './category'
import PageStore from './pages'
import SocialStore from './social'
import UserStore from './user'
import MusicStore from './music'

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
  as?: string
  independent?: boolean
}

export interface SocialLinkModel {
  icon: IconDefinition
  title?: string
  url: string
  color?: string
}

export interface PageModel extends PageDescriptionDto {}

export interface ViewportRecord {
  w: number
  h: number
  mobile: boolean
  pad: boolean
  hpad: boolean
  wider: boolean
  widest: boolean
}

export interface Stores {
  appStore: AppStore
  userStore: UserStore
  socialStore: SocialStore
  pageStore: PageStore
  categoryStore: CategoryStore
  musicStore: MusicStore
}
