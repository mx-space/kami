/*
 * @Author: Innei
 * @Date: 2020-04-16 19:29:33
 * @LastEditTime: 2020-08-04 12:48:25
 * @LastEditors: Innei
 * @FilePath: /mx-web/models/post.ts
 * @Coding with Love
 */

import { BaseRespModel, PagerModel, ImageSizeRecord } from './base'
import { CategoryModel } from './category'

export interface PostModel {
  id: string
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
  tags: string[] | null
  images: ImageSizeRecord[]
}

export interface PostPagerDto extends BaseRespModel, PagerModel {
  data: PostModel[]
}

export interface PostRespModel extends BaseRespModel {
  data: PostModel
}
