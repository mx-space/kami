/*
 * @Author: Innei
 * @Date: 2020-06-14 21:19:46
 * @LastEditTime: 2020-08-04 12:59:01
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/store/category.ts
 * @Coding with Love
 */

import { makeAutoObservable } from 'mobx'
import { CategoriesResp, CategoryModel } from 'models/category'
import { appStore } from '.'
import { Rest } from '../../utils/api'
import { MenuModel } from './types'
export default class CategoryStore {
  constructor() {
    makeAutoObservable(this)
  }
  categories: CategoryModel[] = []

  async fetchCategory() {
    if (this.categories.length > 0) {
      return
    }
    await this.updateCategory()
  }

  setCategory(categories: CategoryModel[]) {
    const postMenu = appStore.menu.find((menu) => menu.type === 'Post')
    const models: MenuModel[] = categories.map((category) => {
      const { _id, slug, name } = category
      return {
        title: name,
        _id,
        path: '/category/[slug]',
        as: '/category/' + slug,
        type: 'Custom',
      }
    })
    postMenu?.subMenu!.push(...models)
    this.categories = categories
  }
  async updateCategory() {
    const { data } = await Rest('Category').get<CategoriesResp>(undefined, {
      params: {
        type: 'Category',
      },
    })
    this.categories.push(...data)
  }

  get CategoryMap() {
    const map = new Map()

    this.categories.map((category) => {
      map.set(category._id, category.slug)
    })
    return new Map(map)
  }
}
