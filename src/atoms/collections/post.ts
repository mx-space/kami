import type { ModelWithLiked, PostModel } from '@mx-space/api-client'

import type { WithMeta } from '~/types/api-client'
import { apiClient } from '~/utils/client'

import { createCollection } from './utils/base'

type PostModelWithMeta = WithMeta<PostModel>

interface IPostCollection {
  fetchBySlug(
    category: string,
    slug: string,
    lang?: string,
  ): Promise<ModelWithLiked<PostModelWithMeta>>
  up(id: string): void
}
export const usePostCollection = createCollection<PostModelWithMeta, IPostCollection>(
  'post',
  (setState) => {
    return {
      async fetchBySlug(category, slug, lang) {
        const data = await apiClient.post.getPost(
          category,
          encodeURIComponent(slug),
          { lang: lang === 'original' ? undefined : lang },
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
