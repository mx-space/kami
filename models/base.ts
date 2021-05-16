/*
 * @Author: Innei
 * @Date: 2020-04-14 16:28:20
 * @LastEditTime: 2020-06-14 20:24:23
 * @LastEditors: Innei
 * @FilePath: /mx-web/models/base.ts
 * @Coding with Love
 */

export interface BaseRespModel {
  ok: 0 | 1
  timestamp: string
}

export interface PagerModel {
  page: {
    total: number
    size: number
    currentPage: number
    totalPage: number
    hasPrevPage: boolean
    hasNextPage: boolean
  }
}

export interface BaseModel {
  created: string
  modified: string
  id: string
}

export interface BaseCommentIndexModel extends BaseModel {
  commentsIndex?: number
}
export type ImageSizeRecord = {
  type?: string
  height?: number
  width?: number
  src: string
}
export type ImageMap = Map<
  string,
  {
    type?: string
    height?: number
    width?: number
    src?: string
    accent?: string
  }
>
