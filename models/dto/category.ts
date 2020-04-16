import { BaseRespModel } from './base'

export interface CategoryModel extends BaseRespModel {
  type: string
  count: number
  _id: string
  created: string
  slug: string
  name: string
  modified: string
  id: string
}

export interface CategoriesResp extends BaseRespModel {
  data: CategoryModel[]
}
