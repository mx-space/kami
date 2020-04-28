import { action, observable } from 'mobx'
import configs from 'configs'
import { MusicModel } from 'models/music'
import axios from 'axios'
export default class MusicStore {
  constructor() {
    if (!this.isHide) {
      this.init()
    }
  }

  async init() {
    return await this.setPlaylist([1433810176, 456310390])
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
      this.isPlay = true
      this.isHide = false
    } else {
      this.init().then(() => {
        this.isPlay = true
      })
    }
  }
}
