import { action, computed, observable } from 'mobx'
import { UserDto } from 'models/dto/user'
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
