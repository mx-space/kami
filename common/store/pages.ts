import { makeAutoObservable } from 'mobx'
import { AggregateResp } from 'models/aggregate'
import { PagesPagerRespDto } from '../../models/page'
import { Rest } from '../../utils/api'
import { PageModel } from './types'
export default class PageStore {
  constructor() {
    makeAutoObservable(this)
  }
  pages: PageModel[] | AggregateResp['pageMeta'][] = []

  async updatePages() {
    const { data } = await Rest('Page').gets<PagesPagerRespDto>()
    this.pages = data
  }
  setPages(pages: PageModel[]) {
    this.pages = pages
  }
}
