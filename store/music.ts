import { action, observable } from 'mobx'
import configs from 'configs'
import { MusicModel } from 'models/music'
import axios from 'axios'
export default class MusicStore {
  constructor() {
    this.setPlaylist([1433810176, 456310390])
  }

  @observable playlist: MusicModel[] = []

  @action async setPlaylist(list: number[]) {
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
    this.playlist = playlist
  }
}
