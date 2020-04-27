import { action, observable } from 'mobx'
import configs from 'configs'
import { MusicModel } from 'models/music'

export default class MusicStore {
  @observable playlist: MusicModel[] = [
    {
      name: '光るなら',
      artist: 'Goose house',
      url: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.mp3',
      cover: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.jpg',
      lrc: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.lrc',
      theme: '#ebd0c2',
    },
  ]

  @action setPlaylist(list: MusicModel[]) {
    this.playlist = [...list]
  }
}
