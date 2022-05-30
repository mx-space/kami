/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { PageModel } from '@mx-space/api-client'

import { apiClient } from '~/utils/client'

import { Store } from '../helper/base'
import type { FetchOption } from '../types/options'

export class PageStore extends Store<PageModel> {
  public slugToIdMap = new Map<string, string>()

  async fetchBySlug(slug: string, options: FetchOption = {}) {
    if (!options.force && this.has(this.slugToIdMap.get(slug)!)) {
      return this.get(this.slugToIdMap.get(slug)!)!
    }
    const data = await apiClient.page.getBySlug(slug)
    this.add(data)
    this.slugToIdMap.set(data.slug, data.id)
    return data
  }
}
