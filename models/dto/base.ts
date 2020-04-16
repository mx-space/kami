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

export interface TimeRecord {
  created: string
  modified: string
}
