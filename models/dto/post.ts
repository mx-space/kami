import { BaseRespModel, PagerModel } from './base'
import { CategoryModel } from './category'

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
  category: CategoryModel
  summary?: string
}

export interface PostPagerDto extends BaseRespModel, PagerModel {
  data: PostResModel[]
}

export interface PostSingleDto extends BaseRespModel {
  data: PostResModel
}
