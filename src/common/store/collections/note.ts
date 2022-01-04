/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NoteModel } from '@mx-space/api-client'
import { makeObservable, observable, runInAction } from 'mobx'
import { apiClient } from 'utils'
import { Store } from '../helper/base'
import { Id } from '../helper/structure'
import { FetchOption } from '../types/options'

export class NoteStore extends Store<NoteModel> {
  constructor() {
    super()
    makeObservable(this, {
      relationMap: observable,
    })
  }
  // 记录前后关系
  relationMap = new Map<
    Id,
    [Partial<NoteModel> | undefined, Partial<NoteModel> | undefined]
  >()

  nidToIdMap = new Map<number, Id>()
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
    const data = await apiClient.note.getNoteById(id, password)

    runInAction(() => {
      this.add(data.data)
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
