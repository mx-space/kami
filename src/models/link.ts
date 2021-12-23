/*
 * @Author: Innei
 * @Date: 2020-07-12 14:19:42
 * @LastEditTime: 2020-09-04 20:49:44
 * @LastEditors: Innei
 * @FilePath: /mx-web/models/link.ts
 * @Coding with Love
 */
import { BaseModel } from './base'

export enum LinkType {
  Friend = 0,
  Collection = 1,
}
export enum LinkState {
  Pass,
  Audit,
}

export interface LinkModel extends BaseModel {
  name: string
  url: string
  avatar?: string
  description?: string
  type?: LinkType

  state: LinkState
  hide: boolean
}
