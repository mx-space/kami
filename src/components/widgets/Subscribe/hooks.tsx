import useSWR from 'swr'

import { SubscribeTypeToBitMap } from '@mx-space/api-client'
import { useModalStack } from '@mx-space/kami-design'

import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { apiClient } from '~/utils/client'

import { SubscribeModal } from './modal'

const SWR_CHECK_SUBSCRIBE_KEY = 'subscribe-status'

export const useSubscribeStatus = () => {
  return useSWR(SWR_CHECK_SUBSCRIBE_KEY, apiClient.subscribe.check)
}

export const useIsEnableSubscribe = () => useSubscribeStatus().data?.enable

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
