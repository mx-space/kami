/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { makeObservable, observable, runInAction } from 'mobx'
import { message } from 'react-message-popup'

import type { NoteModel } from '@mx-space/api-client'

import { apiClient } from '~/utils/client'
import { isLikedBefore, setLikeId } from '~/utils/cookie'

import { Store } from '../helper/base'
import type { Id } from '../helper/structure'
import type { FetchOption } from '../types/options'

export class NoteStore extends Store<NoteModel> {
  constructor() {
    super()
    makeObservable(this, {
      relationMap: observable,
      likeIdList: observable,
    })
  }
  // 记录前后关系
  relationMap = new Map<
    Id,
    [Partial<NoteModel> | undefined, Partial<NoteModel> | undefined]
  >()

  nidToIdMap = new Map<number, Id>()

  likeIdList = new Set<string>()

  override get(id: string | number) {
    if (typeof id === 'string') {
      return super.get(id)
    } else {
      const realId = this.nidToIdMap.get(id)
      return realId ? super.get(realId) : undefined
    }
  }

  async like(id: number) {
    const note = this.get(id)
    if (!note) {
      return false
    }
    const errorMessage = '你已经喜欢过啦'

    if (this.isLiked(id)) {
      message.error(errorMessage)
      return
    }

    try {
      await apiClient.note.likeIt(id)
      note.count.like = note.count.like + 1
      message.success('感谢喜欢!')
    } catch {
      message.error(errorMessage)
    } finally {
      this.likeIdList.add(id.toString())
      setLikeId(`note-${note.nid.toString()}`)
    }

    return true
  }

  isLiked(id: number) {
    const storeLiked = this.likeIdList.has(id.toString())

    const inCookie = isLikedBefore(`note-${id.toString()}`)
    if (!storeLiked && inCookie) {
      this.likeIdList.add(id.toString())
    }

    return storeLiked || inCookie
  }

  async fetchById(
    id: string | number,
    password?: string,
    options: FetchOption = {},
  ) {
    if (!options.force) {
      if (typeof id === 'string' && this.has(id)) {
        return this.get(id)!
      } else if (typeof id === 'number') {
        const realId = this.nidToIdMap.get(id)
        if (realId && this.has(realId)) {
          return this.get(realId)!
        }
      }
    }
    const data = await apiClient.note.getNoteById(
      id as number,
      password as string,
    )

    runInAction(() => {
      this.add(data.data)
      // TODO 这边的关系映射的添加 是不是应该覆写 add 方法比较好, 下面也是
      this.nidToIdMap.set(data.data.nid, data.data.id)
      this.relationMap.set(data.data.id, [data.prev, data.next])
    })

    return this.get(data.data.id)!
  }

  async fetchLatest() {
    const data = await apiClient.note.getLatest()

    runInAction(() => {
      this.add(data.data)
      this.nidToIdMap.set(data.data.nid, data.data.id)
      this.relationMap.set(data.data.id, [data.prev, data.next])
    })

    return data.data
  }
}
