/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { apiClient } from 'utils'

import { PostModel } from '@mx-space/api-client'

import { Store } from '../helper/base'

export class PostStore extends Store<PostModel> {
  async fetchBySlug(category: string, slug: string) {
    const data = await apiClient.post.getPost(
      category,
      encodeURIComponent(slug),
    )
    this.add(data)
    return data
  }
}
