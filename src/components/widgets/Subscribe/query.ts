import useSWR from 'swr'

import { apiClient } from '~/utils/client'

const SWR_CHECK_SUBSCRIBE_KEY = 'subscribe-status'

export const useSubscribeStatus = () => {
  return useSWR(SWR_CHECK_SUBSCRIBE_KEY, async () => {
    const result = await apiClient.subscribe.check()
    return result
  })
}
