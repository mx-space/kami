import { action, observable } from 'mobx'
import { AggregateResp } from 'models/aggregate'
import { PagesPagerRespDto } from '../models/dto/page'
import { Rest } from '../utils/api'
import { PageModel } from './types'
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
