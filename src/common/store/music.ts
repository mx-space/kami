/*
 * @Author: Innei
 * @Date: 2020-04-29 17:27:02
 * @LastEditTime: 2020-08-26 20:25:23
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/store/music.ts
 * @Copyright
 */

import { makeAutoObservable, runInAction } from 'mobx'
export default class MusicStore {
  constructor() {
    makeAutoObservable(this)
    if (!this.isHide) {
      this.init()
    }
  }

  list: number[] = []
  _isHide = true
  isPlay = false

  init() {
    this.list = [563534789, 1447327083, 1450252250]
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
        this.init()
      }

      this._isHide = false
      this.isPlay = true
    })
  }

  get isHide() {
    return this._isHide && !this.isPlay
  }
}
