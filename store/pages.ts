import { action, observable } from 'mobx'
import { PageModel } from './types'
import { Rest } from '../utils/api'
import { PagesPagerRespDto } from '../models/dto/page'
import { AggregateResp } from 'models/aggregate'
export default class PageStore {
  @observable pages: PageModel[] | AggregateResp['pageMeta'][] = []

  @action async updatePages() {
    const { data } = await Rest('Page').gets<PagesPagerRespDto>()
    this.pages = data
  }
  @action setPages(pages: PageModel[]) {
    this.pages = pages
  }
}
