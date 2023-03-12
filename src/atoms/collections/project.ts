import type { ProjectModel } from '@mx-space/api-client'

import { apiClient } from '~/utils/client'

import { createCollection } from './utils/base'

interface ProjectCollection {
  fetchById(id: string, force?: boolean): Promise<any>
}
export const useProjectCollection = createCollection<
  ProjectModel,
  ProjectCollection
>('project', (setState, getState) => {
  return {
    async fetchById(id, force) {
      const state = getState()
      if (!force && state.data.has(id)) {
        return state.data.get(id)!
      }
      const data = await apiClient.project.getById(id)

      state.add(data)
      return data
    },
  }
})
