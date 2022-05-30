import type { SayModel } from '@mx-space/api-client'

import { Store } from '~/store/helper/base'
import { apiClient } from '~/utils/client'

export class SayStore extends Store<SayModel> {
  async fetch(page: number, size: number) {
    const data = await apiClient.say.getAllPaginated(page, size)
    this.add(data.data)
    return { ...data }
  }

  async fetchAll() {
    const data = await apiClient.say.getAll()
    this.add(data.data)
    return { ...data }
  }
}
