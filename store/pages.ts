import { action, observable } from 'mobx'
import { PageModel } from './types'
import { Rest } from '../utils/api'
import { PagesPagerRespDto } from '../models/dto/page'
export default class PageStore {
  @observable pages: PageModel[] = []

  @action async fetchPages() {
    const { data } = await Rest('Page').gets<PagesPagerRespDto>()
    this.pages = data
  }
}
