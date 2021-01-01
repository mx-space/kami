import { BaseRespModel, BaseModel, ImageSizeRecord } from './base'
export interface CountRecord {
  read: number
  like: number
}
export interface NoteModel extends BaseModel {
  commentsIndex: number
  allowComment?: boolean
  hide: boolean
  count: CountRecord
  _id: string
  title: string
  text: string
  mood?: string
  weather?: string
  hasMemory?: boolean
  nid: number
  id: string
  images: ImageSizeRecord[]
  music?: NoteMusicRecord[]
}

export interface NoteMusicRecord {
  type: string
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
