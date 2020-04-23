import { BaseRespModel, PagerModel, TimeRecord } from './base'

export interface SayModel extends TimeRecord {
  _id?: string
  text: string
  source?: string
  author?: string
}
export interface SayRespDto extends BaseRespModel {
  data: SayModel[]
  page: PagerModel
}
