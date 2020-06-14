import { BaseRespModel, PagerModel, BaseModel } from './base'

export interface CommentModel extends BaseModel {
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
  id: string
  avatar: string
}
export interface CommentPager extends BaseRespModel, PagerModel {
  data: CommentModel[]
}
