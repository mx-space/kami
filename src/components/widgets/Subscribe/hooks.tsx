import useSWR from 'swr'

import type { SubscribeTypeToBitMap } from '@mx-space/api-client'

import { useModalStack } from '~/components/ui/Modal'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { apiClient } from '~/utils/client'

import { SubscribeModal } from './modal'

const SWR_CHECK_SUBSCRIBE_KEY = 'subscribe-status'

export const useSubscribeStatusQuery = () => {
  return useSWR(SWR_CHECK_SUBSCRIBE_KEY, apiClient.subscribe.check, {
    refreshInterval: 60_000 * 10,
  })
}

export const useIsEnableSubscribe = () => useSubscribeStatusQuery().data?.enable

export const usePresentSubscribeModal = (
  source: string,
  defaultTypes?: (keyof typeof SubscribeTypeToBitMap)[],
) => {
  const { event } = useAnalyze()
  const { present } = useModalStack()

  return {
    present: () => {
      const dispose = present({
        modalProps: {
          title: '邮件订阅',
          closeable: true,
          useRootPortal: true,
          blur: false,
        },

        overlayProps: {
          stopPropagation: true,
          darkness: 0.5,
        },
        component: () => (
          <SubscribeModal onConfirm={dispose} defaultTypes={defaultTypes} />
        ),
        useBottomDrawerInMobile: false,
      })

      event({
        action: TrackerAction.Impression,
        label: `订阅弹窗唤起-${source}`,
      })
    },
  }
}
