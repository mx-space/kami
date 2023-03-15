import type { ModelWithLiked, PostModel } from '@mx-space/api-client'

import { apiClient } from '~/utils/client'

import { createCollection } from './utils/base'

interface IPostCollection {
  fetchBySlug(
    category: string,
    slug: string,
  ): Promise<ModelWithLiked<PostModel>>
  up(id: string): void
}
export const usePostCollection = createCollection<PostModel, IPostCollection>(
  'post',
  (setState) => {
    return {
      async fetchBySlug(category, slug) {
        const data = await apiClient.post.getPost(
          category,
          encodeURIComponent(slug),
        )
        setState((state) => {
          state.data.set(data.id, data)
        })
        return data
      },
      up(id: string) {
        setState((state) => {
          const post = state.data.get(id)
          if (post) {
            post.count.like += 1
          }
        })
      },
    }
  },
)
