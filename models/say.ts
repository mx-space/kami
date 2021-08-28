import { BaseModel, BaseRespModel, PagerModel } from './base'

export interface SayModel extends BaseModel {
  text: string
  source?: string
  author?: string
}
export interface SayRespDto extends BaseRespModel {
  data: SayModel[]
  page: PagerModel
}
