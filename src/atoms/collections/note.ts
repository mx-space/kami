import { produce } from 'immer'
import { message } from 'react-message-popup'

import type { ModelWithLiked, NoteModel } from '@mx-space/api-client'

import type { Id } from '~/store/helper/structure'
import type { FetchOption } from '~/store/types/options'
import { apiClient } from '~/utils/client'
import { isLikedBefore, setLikeId } from '~/utils/cookie'

import { createCollection } from './utils/base'

interface NoteCollection {
  relationMap: Map<
    Id,
    [Partial<NoteModel> | undefined, Partial<NoteModel> | undefined]
  >
  nidToIdMap: Map<number, Id>
  likeIdList: Set<string>
  get(id: string | number): NoteModel | undefined
  like(id: number): Promise<boolean | undefined>
  isLiked(id: number): boolean
  fetchById(
    id: string | number,
    password?: string,
    options?: FetchOption,
  ): Promise<
    NoteModel & {
      isDeleted?: boolean | undefined
    }
  >
  fetchLatest(): Promise<ModelWithLiked<NoteModel>>
}

export const useNoteCollection = createCollection<NoteModel, NoteCollection>(
  'note',
  (setState, getState) => ({
    relationMap: new Map<
      Id,
      [Partial<NoteModel> | undefined, Partial<NoteModel> | undefined]
    >(),
    nidToIdMap: new Map<number, Id>(),
    likeIdList: new Set<string>(),
    get(id: string | number) {
      const collection = getState().data

      if (typeof id === 'string') {
        return collection.get(id)
      } else {
        const realId = getState().nidToIdMap.get(id)
        return realId ? collection.get(realId) : undefined
      }
    },
    async like(id: number) {
      const state = getState()
      const note = state.get(id)
      if (!note) {
        return false
      }
      const errorMessage = '你已经喜欢过啦'

      if (state.isLiked(id)) {
        message.error(errorMessage)
        return
      }

      let likeSuccess = false
      await apiClient.note
        .likeIt(id)
        .then(() => {
          likeSuccess = true
        })
        .catch(() => {
          likeSuccess = false
        })

      setState(
        produce((state: ReturnType<typeof getState>) => {
          if (!likeSuccess) {
            note.count.like = note.count.like + 1
            message.success('感谢喜欢！')
            state.likeIdList.add(id.toString())
            setLikeId(`note-${note.nid.toString()}`)
          } else {
            message.error(errorMessage)
          }
        }),
      )
      return true
    },
    isLiked(id: number) {
      const state = getState()
      const storeLiked = state.likeIdList.has(id.toString())

      const inCookie = isLikedBefore(`note-${id.toString()}`)
      if (!storeLiked && inCookie) {
        setState(
          produce((state: ReturnType<typeof getState>) => {
            state.likeIdList.add(id.toString())
          }),
        )
      }

      return storeLiked || inCookie
    },

    async fetchById(
      id: string | number,
      password?: string,
      options: FetchOption = {},
    ) {
      const state = getState()
      const collection = state.data
      if (!options.force) {
        if (typeof id === 'string' && collection.has(id)) {
          return collection.get(id)!
        } else if (typeof id === 'number') {
          const realId = state.nidToIdMap.get(id)
          if (realId && collection.has(realId)) {
            return collection.get(realId)!
          }
        }
      }
      const data = await apiClient.note.getNoteById(
        id as number,
        password as string,
      )

      setState(
        produce((state: ReturnType<typeof getState>) => {
          state.add(data.data)
          // TODO 这边的关系映射的添加 是不是应该覆写 add 方法比较好，下面也是
          state.nidToIdMap.set(data.data.nid, data.data.id)
          state.relationMap.set(data.data.id, [data.prev, data.next])
        }),
      )
      // return state.get(data.data.id)!
      const result = state.get(data.data.id)!

      return result
    },
    async fetchLatest() {
      const data = await apiClient.note.getLatest()

      setState(
        produce((state: ReturnType<typeof getState>) => {
          state.add(data.data)
          state.nidToIdMap.set(data.data.nid, data.data.id)
          state.relationMap.set(data.data.id, [data.prev, data.next])
        }),
      )

      return data.data
    },
  }),
)

export const noteCollection = useNoteCollection.getState()
