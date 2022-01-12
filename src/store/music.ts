import { makeAutoObservable, runInAction } from 'mobx'
export class MusicStore {
  constructor() {
    makeAutoObservable(this)
    if (!this.isHide) {
      this.reset()
    }
  }

  list: number[] = []
  isHide = true
  isPlay = false

  reset() {
    runInAction(() => {
      this.isHide = true
      this.isPlay = false
      this.resetList()
    })
  }

  resetList() {
    this.list = window.data?.config.function.player.id ?? [
      563534789, 1447327083, 1450252250,
    ]
  }

  empty() {
    this.list = []
  }

  setPlay(play: boolean) {
    if (this.list.length === 0) {
      this.resetList()
    }
    this.isPlay = play
  }

  setHide(hide: boolean) {
    runInAction(() => {
      this.isHide = hide

      if (hide) {
        this.isPlay = false
      }
    })
  }

  async setPlaylist(list: number[]) {
    this.list = [...list]

    return this.list
  }

  play() {
    runInAction(() => {
      if (this.list.length == 0) {
        this.reset()
      }

      this.isHide = false
      this.isPlay = true
    })
  }
}
