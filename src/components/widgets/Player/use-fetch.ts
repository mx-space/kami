import { startTransition, useEffect, useState } from 'react'

import { apiClient } from '~/utils/client'

const CACHE_KEY_PREFIX = 'kami-netease-lyric-'
export const useFetchLyrics = (id: number) => {
  const [lyrics, setLyrics] = useState('')
  useEffect(() => {
    setLyrics('')
    if (id === 0) {
      return
    }
    startTransition(() => {
      const fromCache = localStorage.getItem(`${CACHE_KEY_PREFIX}${id}`)
      if (fromCache) {
        setLyrics(fromCache)
        return
      }

      apiClient.serverless.proxy.kami.lyrics
        .get<string>({
          params: {
            id,
          },
        })
        .then((res) => {
          setLyrics(res)

          localStorage.setItem(`${CACHE_KEY_PREFIX}${id}`, res)
        })
    })
  }, [id])
  return lyrics
}
