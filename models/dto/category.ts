import { BaseRespModel } from './base'

export interface CategoryModel {
  type: string
  count: number
  _id: string
  created: string
  slug: string
  name: string
  modified: string
}

export interface CategoriesResp extends BaseRespModel {
  data: CategoryModel[]
}
