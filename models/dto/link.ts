import { BaseModel } from './base'

export enum LinkType {
  Friend = 0,
  Collection = 1,
}

export interface LinkModel extends BaseModel {
  name: string
  url: string
  avatar?: string
  description?: string
  type?: LinkType
}
