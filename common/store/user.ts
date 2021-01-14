/*
 * @Author: Innei
 * @Date: 2020-09-17 14:02:24
 * @LastEditTime: 2021-01-14 13:39:35
 * @LastEditors: Innei
 * @FilePath: /web/common/store/user.ts
 * @Mark: Coding with Love
 */
import { makeAutoObservable } from 'mobx'
import { UserDto } from 'models/user'
import { Rest } from 'utils'

export interface UrlConfig {
  adminUrl: string
  backendUrl: string

  frontendUrl: string
}
export default class UserStore {
  constructor() {
    makeAutoObservable(this)
  }
  master: Partial<UserDto> = {}
  token: string | null = null
  get isLogged() {
    return !!this.token
  }

  url: UrlConfig | null = null
  setUser(model: UserDto) {
    this.master = model
  }

  setUrl(url: UrlConfig) {
    this.url = url
  }

  async fetchUrl() {
    if (!this.isLogged) {
      return
    }
    const { data } = await Rest('Option').get<{ data: UrlConfig }>('url')
    this.url = data
  }

  get username() {
    return this.master.username
  }

  get name() {
    return this.master.name
  }
  get introduce() {
    return this.master.introduce || null
  }
  setToken(token?: string) {
    if (!token) {
      return (this.token = null)
    }
    this.token = token
    this.fetchUrl()
  }
}
