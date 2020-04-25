import { observable, computed, action } from 'mobx'
import { MenuModel } from './types'
import { UserDto } from 'models/dto/user'
import { Rest } from 'utils/api'
export default class UserStore {
  @observable master: Partial<UserDto> = {}

  @action setUser(model: UserDto) {
    this.master = model
  }

  @computed get username() {
    return this.master.username
  }

  @computed get name() {
    return this.master.name
  }
  @computed get introduce() {
    return this.master.introduce || null
  }
}
