import { immerable } from 'immer'

import type { ModelWithLiked, PostModel } from '@mx-space/api-client'

import type { WithMeta } from '~/types/api-client'
import { apiClient } from '~/utils/client'
import {
  type LocalizedContent,
  withContentLocale,
} from '~/utils/translation'

import { createCollection } from './utils/base'

export type PostModelWithMeta = WithMeta<PostModel> & LocalizedContent
const localizedKey = (id: string, locale: string) => `${id}:${locale}`

interface IPostCollection {
  localizedData: Map<string, PostModelWithMeta>
  getLocalized(id: string, locale: string): PostModelWithMeta | undefined
  cacheLocalized(data: PostModelWithMeta, locale: string): void
  fetchBySlug(
    category: string,
    slug: string,
    lang?: string,
  ): Promise<ModelWithLiked<PostModelWithMeta>>
  up(id: string): void
}
export const usePostCollection = createCollection<PostModelWithMeta, IPostCollection>(
  'post',
  (setState, getState) => {
    const localizedData = new Map<string, PostModelWithMeta>()
    localizedData[immerable] = true
    const latestLocaleByResource = new Map<string, string>()
    return {
      localizedData,
      getLocalized(id, locale) {
        return getState().localizedData.get(localizedKey(id, locale))
      },
      cacheLocalized(data, locale) {
        const localized = withContentLocale(data, locale)
        setState((state) => {
          state.localizedData.set(localizedKey(localized.id, locale), localized)
          state.data.set(localized.id, localized)
        })
      },
      async fetchBySlug(category, slug, lang) {
        const locale = lang === 'original' ? 'zh' : (lang ?? 'zh')
        const resourceKey = `${category}/${slug}`
        latestLocaleByResource.set(resourceKey, locale)
        const data = await apiClient.post.getPost(
          category,
          encodeURIComponent(slug),
          { lang: lang === 'original' ? undefined : lang },
        )
        const localized = withContentLocale(data, locale)
        setState((state) => {
          state.localizedData.set(localizedKey(localized.id, locale), localized)
          // Components outside the locale-aware detail view still read `data`.
          // Only the most recently requested locale may update that fallback.
          if (latestLocaleByResource.get(resourceKey) === locale) {
            state.data.set(localized.id, localized)
          }
        })
        return localized
      },
      up(id: string) {
        setState((state) => {
          const post = state.data.get(id)
          if (post) {
            post.likeCount += 1
          }
        })
      },
    }
  },
)
