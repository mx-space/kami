import { useModalStack } from '@mx-space/kami-design'
import { SubscribeOutlined } from '@mx-space/kami-design/components/Icons'

import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { SubscribeModal } from './modal'

export const SubscribeEmail = () => {
  const { event } = useAnalyze()
  const { present, disposeAll } = useModalStack()

  const handleSubscribe = () => {
    event({
      action: TrackerAction.Click,
      label: `底部订阅点击`,
    })
    present({
      modalProps: {
        title: '邮件订阅',
        closeable: true,
        useRootPortal: true,
        noBlur: true,
      },
      overlayProps: {
        stopPropagation: true,
      },
      component: <SubscribeModal onClose={disposeAll} />,
    })
  }

  return (
    <button aria-label="subscribe" onClick={handleSubscribe}>
      <SubscribeOutlined />
    </button>
  )
}

