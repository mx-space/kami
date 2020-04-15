import { BaseRespModel, PagerModel } from './base'

export interface PostResModel {
  _id: string
  created: string
  modified: string
  hide: boolean
  commentsIndex: number
  title: string
  text: string
  slug: string
  categoryId: string
}

export interface PostPagerDto extends BaseRespModel, PagerModel {
  data: PostResModel[]
}
