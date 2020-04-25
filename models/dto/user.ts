import { BaseRespModel } from './base'

export interface UserDto extends BaseRespModel {
  _id: string
  username: string
  mail: string
  name: string
  url: string
  created: string
  modified: string
  lastLoginIp: string
  lastLoginTime: string
  id: string
  avatar: string
  introduce?: string
}
