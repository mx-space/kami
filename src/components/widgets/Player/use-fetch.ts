import useSWR from 'swr'

import { apiClient } from '~/utils/client'

const CACHE_KEY_PREFIX = 'kami-netease-lyric-'
export const useFetchLyrics = (id: number) => {
  const { data: lyrics } = useSWR(
    ['lyrics', id],
    async ([, id]) => {
      if (id === 0) {
        return ''
      }

      const fromCache = localStorage.getItem(`${CACHE_KEY_PREFIX}${id}`)
      if (fromCache) {
        return fromCache
      }

      return await apiClient.serverless.proxy.kami.lyrics
        .get<string>({
          params: {
            id,
          },
        })
        .then((res) => {
          localStorage.setItem(`${CACHE_KEY_PREFIX}${id}`, res)
          return res
        })
    },
    {
      refreshInterval: 0,
    },
  )

  return lyrics
}
