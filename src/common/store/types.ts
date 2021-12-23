/*
 * @Author: Innei
 * @Date: 2021-01-07 20:13:09
 * @LastEditTime: 2021-01-14 13:37:29
 * @LastEditors: Innei
 * @FilePath: /web/common/store/types.ts
 * @Mark: Coding with Love
 */
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { UrlObject } from 'url'
import { PageDescriptionDto } from '../../models/page'

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
