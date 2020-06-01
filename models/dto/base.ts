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
  _id: string
}

export interface BaseCommentIndexModel extends BaseModel {
  commentsIndex?: number
}

export interface ImageSizeRecord {
  type?: string
  height?: number
  width?: number
}
