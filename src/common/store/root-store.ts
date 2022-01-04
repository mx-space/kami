import ActionStore from './action'
import AppUIStore from './app'
import { NoteStore } from './collections/note'
import { PostStore } from './collections/post'
import GatewayStore from './gateway'
import MusicStore from './music'
import UserStore from './user'

export const gatewayStore = new GatewayStore()
export const userStore = new UserStore()
export const appUIStore = new AppUIStore()

export const musicStore = new MusicStore()

export const actionStore = new ActionStore()

// collections start
export const postStore = new PostStore()
export const noteStore = new NoteStore()

export interface RootStore {
  gatewayStore: GatewayStore
  userStore: UserStore
  appUIStore: AppUIStore

  musicStore: MusicStore

  actionStore: ActionStore

  // collections start
  postStore: PostStore
  noteStore: NoteStore
}
export class RootStore {
  constructor() {
    this.gatewayStore = gatewayStore
    this.userStore = userStore
    this.appUIStore = appUIStore
    this.musicStore = musicStore
    this.actionStore = actionStore
    this.postStore = postStore
    this.noteStore = noteStore
  }

  get appStore() {
    return this.appUIStore
  }
}
