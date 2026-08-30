import { immerable } from 'immer'
import { message } from 'react-message-popup'

import type { ModelWithLiked, NoteModel } from '@mx-space/api-client'

import type { FetchOption } from '~/atoms/types'
import type { WithMeta } from '~/types/api-client'
import { apiClient } from '~/utils/client'
import { isLikedBefore, setLikeId } from '~/utils/cookie'
import {
  type LocalizedContent,
  withContentLocale,
} from '~/utils/translation'

import { createCollection } from './utils/base'

export type NoteModelWithId = WithMeta<NoteModel> &
  LocalizedContent & {
    id: string
    [key: string]: any
  }
const localizedKey = (id: string, locale: string) => `${id}:${locale}`

interface NoteCollection {
  relationMap: Map<
    string,
    [Partial<NoteModelWithId> | undefined, Partial<NoteModelWithId> | undefined]
  >
  nidToIdMap: Map<number, string>
  localizedData: Map<string, NoteModelWithId>
  likeIdList: Set<string>
  get(id: string | number): NoteModelWithId | undefined
  getLocalized(id: string | number, locale: string): NoteModelWithId | undefined
  cacheLocalized(data: NoteModelWithId, locale: string): void
  like(
    id: number,
    messages?: { alreadyLiked: string; thanksLike: string },
  ): Promise<boolean | undefined>
  isLiked(id: number): boolean
  fetchById(
    id: string | number,
    password?: string,
    options?: FetchOption,
  ): Promise<
    NoteModelWithId & {
      isDeleted?: boolean | undefined
    }
  >
  fetchLatest(lang?: string): Promise<ModelWithLiked<NoteModelWithId>>
  bookmark(id: string): Promise<void>
}

export const useNoteCollection = createCollection<NoteModelWithId, NoteCollection>(
  'note',
  (setState, getState) => {
    const relationMap = new Map<
      string,
      [Partial<NoteModelWithId> | undefined, Partial<NoteModelWithId> | undefined]
    >()
    const nidToIdMap = new Map<number, string>()
    const localizedData = new Map<string, NoteModelWithId>()
    const likeIdList = new Set<string>()
    const latestLocaleByResource = new Map<string, string>()

    relationMap[immerable] = true
    nidToIdMap[immerable] = true
    localizedData[immerable] = true
    likeIdList[immerable] = true

    const getCollection = () => getState().data

    return {
      relationMap,
      nidToIdMap,
      localizedData,
      likeIdList,
      get(id: string | number) {
        if (typeof id === 'string') {
          return getCollection().get(id)
        } else {
          const realId = getState().nidToIdMap.get(id)
          return realId ? getCollection().get(realId) : undefined
        }
      },
      getLocalized(id, locale) {
        const realId =
          typeof id === 'string' ? id : getState().nidToIdMap.get(id)
        return realId
          ? getState().localizedData.get(localizedKey(realId, locale))
          : undefined
      },
      cacheLocalized(data, locale) {
        const localized = withContentLocale(data, locale)
        setState((state) => {
          state.localizedData.set(localizedKey(localized.id, locale), localized)
          state.data.set(localized.id, localized)
          state.nidToIdMap.set(localized.nid, localized.id)
        })
      },
      async like(
        id: number,
        messages?: { alreadyLiked: string; thanksLike: string },
      ) {
        const state = getState()
        const note = state.get(id)

        if (!note) {
          return false
        }

        const msgAlreadyLiked = messages?.alreadyLiked ?? '你已经喜欢过啦'
        const msgThanks = messages?.thanksLike ?? '感谢喜欢！'

        if (state.isLiked(id)) {
          message.error(msgAlreadyLiked)
          return
        }

        let likeSuccess = false
        const objectId = getState().get(id)?.id
        if (!objectId) {
          return
        }
        await apiClient.activity
          .likeIt('Note', objectId)
          .then(() => {
            likeSuccess = true
          })
          .catch(() => {
            likeSuccess = false
          })

        setState((state) => {
          const note = state.get(id)

          if (!note) return
          const nextNote = { ...note }
          if (likeSuccess) {
            nextNote.likeCount = note.likeCount + 1

            message.success(msgThanks)
            state.likeIdList.add(id.toString())
            requestAnimationFrame(() => {
              getState().addOrPatch(nextNote)
            })
            setLikeId(`note-${note.nid.toString()}`)
          }
        })
        return true
      },
      isLiked(id: number) {
        const state = getState()
        const storeLiked = state.likeIdList.has(id.toString())

        const inCookie = isLikedBefore(`note-${id.toString()}`)
        if (!storeLiked && inCookie) {
          setState((state) => {
            state.likeIdList.add(id.toString())
          })
        }

        return storeLiked || inCookie
      },

      async fetchById(
        id: string | number,
        password?: string,
        options: FetchOption = {},
      ) {
        const state = getState()
        const collection = getCollection()
        const locale = options.lang ?? 'zh'
        if (!options.force) {
          const cachedLocalized = state.getLocalized(id, locale)
          if (cachedLocalized) {
            return cachedLocalized
          }
          if (typeof id === 'string' && collection.has(id)) {
            return collection.get(id)!
          } else if (typeof id === 'number') {
            const realId = state.nidToIdMap.get(id)
            if (realId && collection.has(realId)) {
              return collection.get(realId)!
            }
          }
        }
        const resourceKey = String(id)
        latestLocaleByResource.set(resourceKey, locale)
        const data =
          typeof id === 'number'
            ? await apiClient.note.getNoteByNid(id, {
                password,
                lang: options.lang,
              })
            : await apiClient.note.proxy(id).get<any>({
                params: { password, lang: options.lang },
              })
        const noteData = (data.data?.id ? data.data : data) as NoteModelWithId
        const localized = withContentLocale(noteData, locale)
        setState((state) => {
          state.localizedData.set(localizedKey(localized.id, locale), localized)
          state.nidToIdMap.set(localized.nid, localized.id)
          state.relationMap.set(localized.id, [data.prev, data.next])
          if (latestLocaleByResource.get(resourceKey) === locale) {
            state.data.set(localized.id, localized)
          }
        })

        return localized
      },
      async fetchLatest(lang = 'zh') {
        const data = await apiClient.note.proxy.latest.get<any>({
          params: { lang },
        })
        const noteData = (data.data?.id
          ? data.data
          : data) as ModelWithLiked<NoteModelWithId>
        const localized = withContentLocale(noteData, lang)
        setState((state) => {
          state.localizedData.set(localizedKey(localized.id, lang), localized)
          state.data.set(localized.id, localized)
          state.nidToIdMap.set(localized.nid, localized.id)
          state.relationMap.set(localized.id, [data.prev, data.next])
        })

        return localized
      },
      async bookmark(id: string) {
        const note = getState().get(id)
        const bookmark = note?.bookmark
        await apiClient.note.proxy(id).patch({ data: { hasMemory: !bookmark } })
        setState((state) => {
          const note = state.get(id)
          if (note) {
            const nextNote = { ...note }
            nextNote.bookmark = !bookmark
            requestAnimationFrame(() => {
              getState().addOrPatch(nextNote)
            })
          }
        })
      },
    }
  },
)

export const noteCollection = useNoteCollection.getState()
