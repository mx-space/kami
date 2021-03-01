/*
 * @Author: Innei
 * @Date: 2020-09-17 14:02:24
 * @LastEditTime: 2021-02-26 16:24:08
 * @LastEditors: Innei
 * @FilePath: /web/common/store/pages.ts
 * @Mark: Coding with Love
 */
import { makeAutoObservable } from 'mobx'
import { AggregateResp } from 'models/aggregate'
import { PageModel } from './types'
export default class PageStore {
  constructor() {
    makeAutoObservable(this)
  }
  pages: PageModel[] | AggregateResp['pageMeta'][] = []

  setPages(pages: PageModel[]) {
    this.pages = pages
  }
}
