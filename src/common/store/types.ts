import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { UrlObject } from 'url'

export declare enum LayoutType {
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
  type?: keyof typeof LayoutType
  path: string
  subMenu?: MenuModel[]
  icon?: IconDefinition | string
  as?: string | UrlObject
  independent?: boolean
}

export interface SocialLinkModel {
  icon: IconDefinition | string
  title?: string
  url: string
  color?: string
}

export interface ViewportRecord {
  w: number
  h: number
  mobile: boolean
  pad: boolean
  hpad: boolean
  wider: boolean
  widest: boolean
}
