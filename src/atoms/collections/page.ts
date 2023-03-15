import type { PageModel } from '@mx-space/api-client'

import type { FetchOption } from '~/atoms/types'
import { apiClient } from '~/utils/client'

import type { ModelWithDeleted } from './utils/base'
import { createCollection } from './utils/base'

interface IPageCollection {
  slugToIdMap: Map<string, string>
  fetchBySlug(
    slug: string,
    options?: FetchOption,
  ): Promise<ModelWithDeleted<PageModel>>
}
export const usePageCollection = createCollection<PageModel, IPageCollection>(
  'page',
  (setState, getState) => {
    return {
      slugToIdMap: new Map<string, string>(),
      async fetchBySlug(slug, options = {}) {
        const state = getState()
        if (!options.force && state.data.has(state.slugToIdMap.get(slug)!)) {
          return state.data.get(state.slugToIdMap.get(slug)!)!
        }
        const data = await apiClient.page.getBySlug(slug)
        state.add(data)
        const newMap = new Map(state.slugToIdMap)
        newMap.set(data.slug, data.id)
        setState({
          slugToIdMap: newMap,
        })
        return data
      },
    }
  },
)
