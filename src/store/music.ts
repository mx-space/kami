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

  /** 正在播放的歌曲 ID */
  playId = 0
  /** 当前时间 */
  time = 0
  /** 持续时间 */
  duration = 0

  get playProgress() {
    const percent = this.time / this.duration
    return isNaN(percent) ? 0 : percent
  }

  setPlayingInfo(id: number, time: number, duration: number) {
    runInAction(() => {
      this.playId = id
      this.time = time
      this.duration = duration
    })
  }

  reset() {
    this.isHide = true
    this.isPlay = false
    this.resetPlayingSongState()
    this.resetList()
  }
  private resetPlayingSongState() {
    this.duration = 0
    this.time = 0
    this.playId = 0
  }
  resetList() {
    this.resetPlayingSongState()
    this.list = window.data?.config.function.player.id ?? [
      563534789, 1447327083, 1450252250,
    ]
  }

  empty() {
    this.resetPlayingSongState()
    this.list = []
    this.isPlay = false
  }

  setPlay(play: boolean) {
    if (this.list.length === 0) {
      this.resetList()
    }
    this.isPlay = play
  }

  setHide(hide: boolean) {
    this.isHide = hide

    if (hide) {
      this.isPlay = false
    }
  }

  async setPlaylist(list: number[]) {
    this.list = [...list]
    this.resetPlayingSongState()
    return this.list
  }

  play() {
    if (this.list.length == 0) {
      this.reset()
    }

    this.isHide = false
    this.isPlay = true
  }
}
