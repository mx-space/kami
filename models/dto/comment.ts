import { BaseRespModel, TimeRecord, PagerModel } from './base'

export interface CommentModel extends TimeRecord {
  _id: string
  refType: string
  state: number
  children: any[]
  commentsIndex: number
  author: string
  text: string
  mail: string
  url: string
  key: string
  ref: string
  __v: number
}
export interface CommentPager extends BaseRespModel, PagerModel {
  data: CommentModel[]
}
