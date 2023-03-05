import type { Atom } from 'jotai'
import { atom } from 'jotai'

import type { NoteModel } from '@mx-space/api-client'

import { jotaiStore } from '../store'
import { BaseCollection } from './utils/base'
import type { Id } from './utils/structure'

class NoteCollect extends BaseCollection<NoteModel> {
  private dataAtom: Atom<Map<Id, NoteModel>>

  nidToIdMapAtom = atom(new Map<number, Id>())

  likeIdListAtom = atom(new Set<string>())

  constructor() {
    super()
    this.dataAtom = atom(this.data)
  }

  override get(id: string | number) {
    if (typeof id === 'string') {
      return super.get(id)
    } else {
      const nidToIdMap = jotaiStore.get(this.nidToIdMapAtom)
      const realId = nidToIdMap.get(id)
      return realId ? super.get(realId) : undefined
    }
  }
}
