import { immerable } from 'immer'
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
    NoteModel & {
      isDeleted?: boolean | undefined
    }
  >
  fetchLatest(): Promise<ModelWithLiked<NoteModel>>
  bookmark(id: string): Promise<void>
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
            nextNote.count = {
              ...note.count,
              like: note.count.like + 1,
            }

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
        const data =
          typeof id === 'number' && options.lang != null
            ? await apiClient.note.getNoteByNid(id, {
                password,
                lang: options.lang,
              })
            : await apiClient.note.getNoteById(
                id as number,
                password as string,
              )
        const noteData = data.data
        state.add(noteData)
        setState((state) => {
          state.nidToIdMap.set(noteData.nid, noteData.id)
          state.relationMap.set(noteData.id, [data.prev, data.next])
        })

        return noteData
      },
      async fetchLatest() {
        const data = await apiClient.note.getLatest()
        getState().add(data.data)
        setState((state) => {
          state.nidToIdMap.set(data.data.nid, data.data.id)
          state.relationMap.set(data.data.id, [data.prev, data.next])
        })

        return data.data
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
