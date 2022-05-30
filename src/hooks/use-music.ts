import { useEffect, useMemo } from 'react'

import type { NoteMusicRecord } from '@mx-space/api-client'

import { useStore } from '~/store'

export const useMusic = (musicList: number[] | null) => {
  const { musicStore } = useStore()
  useEffect(() => {
    if (!musicList) {
      return
    }
    if (musicList.length === 0) {
      musicStore.empty()
      return
    }
    musicStore.setPlaylist(musicList)
    musicStore.setHide(false)

    return () => {
      musicStore.empty()
      musicStore.setHide(true)
    }
  }, [musicList])
}

export const useNoteMusic = (music?: NoteMusicRecord[]) => {
  const ids = useMemo(
    () =>
      music && Array.isArray(music) && music.length > 0
        ? music.filter((m) => m.id && m.type === 'netease').map((m) => ~~m.id)
        : null,
    [music],
  )
  useMusic(ids)
}
