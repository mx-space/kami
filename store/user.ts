import { observable, computed, action } from 'mobx'
import { MenuModel } from './types'
import { UserDto } from 'models/dto/user'
import { Rest } from 'utils/api'
export default class UserStore {
  @observable master: Partial<UserDto> = {}

  @action setUser(model: UserDto) {
    this.master = model
  }

  @action async fetchUser() {
    const data = await Rest('Master').gets<UserDto>()
    this.master = data
  }
  @computed get username() {
    return this.master.username
  }

  @computed get name() {
    return this.master.name
  }
}
