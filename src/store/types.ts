import type { UrlObject } from 'url'

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
  icon?: JSX.Element | string
  as?: string | UrlObject
  independent?: boolean
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
