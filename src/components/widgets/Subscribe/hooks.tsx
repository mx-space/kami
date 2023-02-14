import useSWR from 'swr'

import { useModalStack } from '@mx-space/kami-design'

import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { apiClient } from '~/utils/client'

import { SubscribeModal } from './modal'

const SWR_CHECK_SUBSCRIBE_KEY = 'subscribe-status'

export const useSubscribeStatus = () => {
  return useSWR(SWR_CHECK_SUBSCRIBE_KEY, apiClient.subscribe.check)
}

export const usePresentSubscribeModal = (source: string) => {
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
        component: () => <SubscribeModal onConfirm={dispose} />,
        useBottomDrawerInMobile: false,
      })

      event({
        action: TrackerAction.Impression,
        label: `订阅弹窗唤起-${source}`,
      })
    },
  }
}
