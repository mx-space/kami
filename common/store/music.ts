/*
 * @Author: Innei
 * @Date: 2020-04-29 17:27:02
 * @LastEditTime: 2020-08-26 20:25:23
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/store/music.ts
 * @Copyright
 */

import axios from 'axios'
import { action, observable } from 'mobx'
import { MusicModel } from 'models/music'
export default class MusicStore {
  constructor() {
    if (!this.isHide) {
      this.init()
    }
  }

  async init() {
    return await this.setPlaylist([
      563534789,
      1447327083,
      528658316,
      1450252250,
    ])
  }

  @observable playlist: MusicModel[] = []
  @observable isPlay = false
  @observable isHide = true

  async getList(list: number[]): Promise<MusicModel[]> {
    const $meting = axios.create({
      baseURL: 'https://api.i-meto.com/meting/api',
    })
    const playlist: MusicModel[] = []
    for await (const id of list) {
      const data = (
        await $meting.get('/', {
          params: {
            server: 'netease',
            id,
          },
        })
      ).data[0]

      playlist.push(data)
    }
    return playlist
  }

  @action async setPlaylist(list: number[]) {
    this.playlist = await this.getList(list)

    this.play()
  }

  @action play() {
    if (this.playlist.length > 0) {
      this.isHide = false
      this.isPlay = true
    } else {
      this.init().then(() => {
        this.isHide = false
        this.isPlay = true
      })
    }
  }
}
