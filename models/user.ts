import { BaseRespModel } from './base'

export interface UserDto extends BaseRespModel {
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
  socialIds?: Record<string, string | number>
}
