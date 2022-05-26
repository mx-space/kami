import ActionStore from './action'
import AppUIStore from './app'
import { CommentStore } from './collections/comment'
import { NoteStore } from './collections/note'
import { PageStore } from './collections/page'
import { PostStore } from './collections/post'
import { ProjectStore } from './collections/project'
import { SayStore } from './collections/say'
import GatewayStore from './gateway'
import { MusicStore } from './music'
import UserStore from './user'

export interface RootStore {
  gatewayStore: GatewayStore
  userStore: UserStore
  appUIStore: AppUIStore

  musicStore: MusicStore

  actionStore: ActionStore

  // collections start
  postStore: PostStore
  noteStore: NoteStore
  commentStore: CommentStore
  pageStore: PageStore
  sayStore: SayStore
  projectStore: ProjectStore
}
export class RootStore {
  constructor() {
    this.gatewayStore = new GatewayStore()
    this.userStore = new UserStore()
    this.appUIStore = new AppUIStore()
    this.musicStore = new MusicStore()
    this.actionStore = new ActionStore()

    this.commentStore = new CommentStore()

    this.postStore = new PostStore()
    this.noteStore = new NoteStore()
    this.pageStore = new PageStore()
    this.sayStore = new SayStore()
    this.projectStore = new ProjectStore()
  }

  get appStore() {
    return this.appUIStore
  }
}
