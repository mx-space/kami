import { action, observable, computed } from 'mobx'
import { CategoriesResp, CategoryModel } from 'models/dto/category'
import { Rest } from '../utils/api'
export default class CategoryStore {
  @observable categories: CategoryModel[] = []

  @action async fetchCategory() {
    if (this.categories.length > 0) {
      return
    }
    await this.updateCategory()
  }

  @action setCategory(categories: CategoryModel[]) {
    this.categories = categories
  }
  @action async updateCategory() {
    const { data } = await Rest('Category').gets<CategoriesResp>()
    this.categories.push(...data)
  }

  @computed get CategoryMap() {
    const map = new Map()

    this.categories.map((category) => {
      map.set(category._id, category.slug)
    })
    return new Map(map)
  }
}
