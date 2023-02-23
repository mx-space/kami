import { SubscribeOutlined } from '@mx-space/kami-design/components/Icons'
import { useModalStack } from '@mx-space/kami-design/components/Modal'

import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'

import { useIsEnableSubscribe } from './hooks'
import { SubscribeModal } from './modal'

export const SubscribeEmail = () => {
  const { event } = useAnalyze()
  const { present } = useModalStack()

  const handleSubscribe = () => {
    event({
      action: TrackerAction.Click,
      label: `底部订阅点击`,
    })
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
  }

  const canSubscribe = useIsEnableSubscribe()

  if (!canSubscribe) return null

  return (
    <button
      aria-label="subscribe"
      onClick={handleSubscribe}
      className="animate-bubble animate-duration-600 animate-repeat-3"
    >
      <SubscribeOutlined />
    </button>
  )
}
