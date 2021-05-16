/*
 * @Author: Innei
 * @Date: 2021-01-01 16:00:14
 * @LastEditTime: 2021-03-12 11:22:15
 * @LastEditors: Innei
 * @FilePath: /web/models/note.ts
 * Mark: Coding with Love
 */
import { BaseRespModel, BaseModel, ImageSizeRecord } from './base'
export interface CountRecord {
  read: number
  like: number
}
export interface NoteModel extends BaseModel {
  commentsIndex: number
  allowComment?: boolean
  secret?: Date | null | undefined
  hide: boolean
  count: CountRecord
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
  next: { id: string; nid: number }
}

export interface NoteResp extends BaseRespModel {
  data: NoteModel
  prev: Partial<NoteModel>
  next: Partial<NoteModel>
}
