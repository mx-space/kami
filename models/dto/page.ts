import { BaseRespModel } from './base'

export interface PageRespDto extends BaseRespModel {
  data: {
    commentsIndex: number
    order: number
    type: string
    _id: string
    created: string
    modified: string
    title: string
    text: string
    slug: string
    subtitle: string
    id: string
    allowComment?: boolean
  }
}

export interface PageDescriptionDto {
  commentsIndex: number
  order: number
  _id: string
  created: string
  modified: string
  title: string
  slug: string
  id: string
}

export interface PagesPagerRespDto extends BaseRespModel {
  data: PageDescriptionDto[]
}
