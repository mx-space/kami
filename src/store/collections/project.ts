import { Store } from 'store/helper/base'
import { apiClient } from 'utils'

import type { ProjectModel } from '@mx-space/api-client'

export class ProjectStore extends Store<ProjectModel> {
  async fetchById(id: string, force = false) {
    if (!force && this.has(id)) {
      return this.get(id)!
    }
    const data = await apiClient.project.getById(id)

    this.add(data)
    return this.get(id)!
  }
}
