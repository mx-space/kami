import type { PaginateResult, SayModel } from '@mx-space/api-client'

import { apiClient } from '~/utils/client'

import { createCollection } from './utils/base'

interface SayCollection {
  fetch(page: number, size: number): Promise<PaginateResult<SayModel>>
  fetchAll(): Promise<ReturnType<typeof apiClient.say.getAll>>
}
export const useSayCollection = createCollection<SayModel, SayCollection>(
  'say',
  // @ts-ignore
  (setState, getState) => {
    return {
      async fetch(page, size) {
        const data = await apiClient.say.getAllPaginated(page, size)
        getState().add(data.data)
        return { ...data }
      },

      async fetchAll() {
        const data = await apiClient.say.getAll()
        getState().add(data.data)
        return { ...data }
      },
    }
  },
)
