import { makeAutoObservable } from 'mobx'
import { UserDto } from 'models/user'
export default class UserStore {
  constructor() {
    makeAutoObservable(this)
  }
  master: Partial<UserDto> = {}
  token: string | null = null
  isLogged = false
  setUser(model: UserDto) {
    this.master = model
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
  }
  setLogged(logged: boolean) {
    this.isLogged = logged
  }
}
