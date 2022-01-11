import { makeAutoObservable, runInAction } from 'mobx'
export default class MusicStore {
  constructor() {
    makeAutoObservable(this)
    if (!this.isHide) {
      this.reset()
    }
  }

  list: number[] = []
  _isHide = true
  isPlay = false

  reset() {
    runInAction(() => {
      this._isHide = true
      this.isPlay = false
      this.list = window.data?.config.function.player.id ?? [
        563534789, 1447327083, 1450252250,
      ]
    })
  }

  empty() {
    this.list = []
  }

  setHide(hide: boolean) {
    runInAction(() => {
      this._isHide = hide
      if (hide) {
        this.isPlay = false
      } else {
        this.play()
      }
    })
  }

  async setPlaylist(list: number[]) {
    this.list = [...list]

    this.play()

    return this.list
  }

  play() {
    runInAction(() => {
      if (this.list.length == 0) {
        this.reset()
      }

      this._isHide = false
      this.isPlay = true
    })
  }

  get isHide() {
    return this._isHide && !this.isPlay
  }
}
