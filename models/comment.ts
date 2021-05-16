import { BaseRespModel, PagerModel, BaseModel } from './base'

export interface CommentModel extends BaseModel {
  id: string
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
  avatar: string

  parent?: string
}
export interface CommentPager extends BaseRespModel, PagerModel {
  data: CommentModel[]
}
