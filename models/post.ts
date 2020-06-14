/*
 * @Author: Innei
 * @Date: 2020-04-16 19:29:33
 * @LastEditTime: 2020-05-31 14:38:06
 * @LastEditors: Innei
 * @FilePath: /mx-web/models/dto/post.ts
 * @Coding with Love
 */

import { BaseRespModel, PagerModel, ImageSizeRecord } from './base'
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
  copyright: boolean
  allowComment?: boolean
  count: {
    read: number
    like: number
  }
  images: ImageSizeRecord[]
}

export interface PostPagerDto extends BaseRespModel, PagerModel {
  data: PostResModel[]
}

export interface PostSingleDto extends BaseRespModel {
  data: PostResModel
}
