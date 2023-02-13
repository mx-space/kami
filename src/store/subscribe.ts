import { makeAutoObservable } from 'mobx'

interface SubscribeOption {
  name?: string
  match?: string
  checked?: boolean
}

export class Subscribestore {
  constructor() {
    makeAutoObservable(this)
  }

  isHide = true

  email = ''

  types: SubscribeOption[] = [
    {
      name: 'post_c',
      match: '博文',
      checked: false,
    },
    {
      name: 'note_c',
      match: '点滴',
      checked: false,
    },
    {
      name: 'say_c',
      match: '说说',
      checked: false,
    },
    {
      name: 'recently_c',
      match: '速记',
      checked: false,
    },
  ]

  setHide(hide: boolean) {
    this.isHide = hide
  }

  setEmail(email: string) {
    this.email = email
  }

  selectTypes(index: number) {
    this.types[index].checked = !this.types[index].checked
  }

  checkAll(check: boolean) {
    this.types.forEach((item) => {
      item.checked = check
    })
  }

  reset() {
    this.email = ''
    this.types.forEach((item) => {
      item.checked = false
    })
  }

  get allCheckedOptions() {
    const checkedOptions = this.types
      .filter((item) => item.checked)
      .map((item) => item.name)
    return checkedOptions.length == this.types.length ? ['all'] : checkedOptions
  }
}
