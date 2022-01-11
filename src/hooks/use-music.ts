import { NoteMusicRecord } from '@mx-space/api-client'
import { useEffect, useMemo } from 'react'
import { useStore } from 'store'

export const useMusic = (musicList: number[]) => {
  const { musicStore } = useStore()
  useEffect(() => {
    if (musicList.length === 0) {
      musicStore.empty()
      return
    }
    musicStore.setPlaylist(musicList)

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
  useMusic(ids || [])
}
