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
  }
}
