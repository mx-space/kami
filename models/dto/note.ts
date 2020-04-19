import { TimeRecord, BaseRespModel } from './base'
export interface CountRecord {
  read: number
  like: number
}
export interface NoteModel extends TimeRecord {
  commentsIndex: number
  hide: boolean
  count: CountRecord
  _id: string
  title: string
  text: string
  mood?: string
  weather?: string
  nid: number
  id: string
}

export interface NoteLastestResp extends BaseRespModel {
  data: NoteModel
  next: { _id: string; nid: number; id: string }
}

export interface NoteResp extends BaseRespModel {
  data: NoteModel
  prev: Partial<NoteModel>
  next: Partial<NoteModel>
}
