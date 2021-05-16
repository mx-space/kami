import { BaseRespModel, ImageSizeRecord } from './base'

export interface PageRespDto extends BaseRespModel {
  data: {
    commentsIndex: number
    order: number
    type: string
    created: string
    modified: string
    title: string
    text: string
    slug: string
    subtitle: string
    id: string
    allowComment?: boolean
    images: ImageSizeRecord[]
  }
}

export interface PageDescriptionDto {
  commentsIndex: number
  order: number
  id: string
  created: string
  modified: string
  title: string
  slug: string
}

export interface PagesPagerRespDto extends BaseRespModel {
  data: PageDescriptionDto[]
}
