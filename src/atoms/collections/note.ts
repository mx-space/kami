import { immerable, produce } from 'immer'
import { message } from 'react-message-popup'

import type { ModelWithLiked, NoteModel } from '@mx-space/api-client'

import type { FetchOption } from '~/atoms/types'
import { apiClient } from '~/utils/client'
import { isLikedBefore, setLikeId } from '~/utils/cookie'

import { createCollection } from './utils/base'

interface NoteCollection {
  relationMap: Map<
    string,
    [Partial<NoteModel> | undefined, Partial<NoteModel> | undefined]
  >
  nidToIdMap: Map<number, string>
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
  (setState, getState) => {
    const relationMap = new Map<
      string,
      [Partial<NoteModel> | undefined, Partial<NoteModel> | undefined]
    >()
    const nidToIdMap = new Map<number, string>()
    const likeIdList = new Set<string>()

    relationMap[immerable] = true
    nidToIdMap[immerable] = true
    likeIdList[immerable] = true

    const getCollection = () => getState().data

    return {
      relationMap,
      nidToIdMap,
      likeIdList,
      get(id: string | number) {
        if (typeof id === 'string') {
          return getCollection().get(id)
        } else {
          const realId = getState().nidToIdMap.get(id)
          return realId ? getCollection().get(realId) : undefined
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
        const collection = getCollection()
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
        state.add(data.data)
        setState(
          produce((state: ReturnType<typeof getState>) => {
            state.nidToIdMap.set(data.data.nid, data.data.id)
            state.relationMap.set(data.data.id, [data.prev, data.next])
          }),
        )

        return data.data
      },
      async fetchLatest() {
        const data = await apiClient.note.getLatest()
        getState().add(data.data)
        setState(
          produce((state: ReturnType<typeof getState>) => {
            state.nidToIdMap.set(data.data.nid, data.data.id)
            state.relationMap.set(data.data.id, [data.prev, data.next])
          }),
        )

        return data.data
      },
    }
  },
)

export const noteCollection = useNoteCollection.getState()
