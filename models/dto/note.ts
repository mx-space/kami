import { BaseRespModel, TimeRecord } from './base'
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
  mood?: keyof typeof Mood
  weather?: keyof typeof Weather
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

export enum Mood {
  'happy' = '开心',
  'sad' = '伤心',
  'angry' = '生气',
  'sorrow' = '悲哀',
  'pain' = '痛苦',
  'terrible' = '可怕',
  'unhappy' = '不快',
  'detestable' = '可恶',
  'worry' = '担心',
  'despair' = '绝望',
  'anxiety' = '焦虑',
  'excite' = '激动',
}
export enum Weather {
  'sunshine' = '晴',
  'cloudy' = '多云',
  'rainy' = '雨',
  'overcast' = '阴',
  'snow' = '雪',
}
export const MoodMap = Object.freeze(Object.fromEntries(Object.entries(Mood)))
export const WeatherMap = Object.freeze(
  Object.fromEntries(Object.entries(Weather)),
)
