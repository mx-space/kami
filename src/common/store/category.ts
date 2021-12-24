/*
 * @Author: Innei
 * @Date: 2020-06-14 21:19:46
 * @LastEditTime: 2021-02-04 13:53:39
 * @LastEditors: Innei
 * @FilePath: /web/common/store/category.ts
 * @Coding with Love
 */

import { CategoryModel } from '@mx-space/api-client'
import uniqBy from 'lodash-es/uniqBy'
import { makeAutoObservable } from 'mobx'
import { apiClient } from 'utils/client'
import { appUIStore } from '.'
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
    const postMenu = appUIStore.menu.find((menu) => menu.type === 'Post')
    if (!postMenu || !postMenu.subMenu) {
      return
    }
    const models: MenuModel[] = categories.map((category) => {
      const { id, slug, name } = category
      return {
        title: name,
        id,

        path: '/category/' + slug,
        type: 'Custom',
      }
    })
    const old = postMenu.subMenu
    postMenu.subMenu = uniqBy([...models, ...old!], 'id')
    this.categories = categories
  }
  async updateCategory() {
    const { data } = await apiClient.category.getAllCategories()
    this.categories.push(...data)
  }

  get CategoryMap() {
    const map = new Map()

    this.categories.map((category) => {
      map.set(category.id, category.slug)
    })
    return new Map(map)
  }
}
