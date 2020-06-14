import { action, computed, observable } from 'mobx'
import { UserDto } from 'models/user'
export default class UserStore {
  @observable master: Partial<UserDto> = {}
  @observable token: string | null = null
  @observable isLogged = false
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
  @action setToken(token?: string) {
    if (!token) {
      return (this.token = null)
    }
    this.token = token
  }
  @action setLogged(logged: boolean) {
    this.isLogged = logged
  }
}
