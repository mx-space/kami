import { noteCollection, useNoteCollection } from './collections/note'
import { usePostCollection } from './collections/post'

Object.assign(globalThis, {
  noteCollection,
  useNoteCollection,
  usePostCollection,
})
