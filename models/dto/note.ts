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
  mood: string

  nid: number
  id: string
}

export interface NoteLastestResp extends BaseRespModel {
  data: NoteModel
  next: { _id: string; nid: number; id: string }
}
