import type { FC } from 'react'

import type { SubscribeTypeToBitMap } from '@mx-space/api-client'
import { TablerBellRinging } from '@mx-space/kami-design/components/Icons/shared'

import {
  useIsEnableSubscribe,
  usePresentSubscribeModal,
} from '../Subscribe/hooks'

type SubscribeType = keyof typeof SubscribeTypeToBitMap
interface SubscribeBellProps {
  defaultType: SubscribeType[] | SubscribeType
}
export const SubscribeBell: FC<SubscribeBellProps> = (props) => {
  const { defaultType } = props
  const canSubscribe = useIsEnableSubscribe()
  const { present } = usePresentSubscribeModal(
    'post-end',
    [].concat(defaultType as any),
  )

  if (!canSubscribe) {
    return null
  }

  return (
    <div className="flex justify-center mb-6">
      <button
        className="p-4 flex flex-col items-center justify-center"
        onClick={present}
      >
        <p className="leading-8 text-gray-1 opacity-80">
          站点已开启邮件订阅，点亮小铃铛，订阅最新文章哦~
        </p>

        <TablerBellRinging className="text-3xl transform scale-150 text-secondary mt-4 opacity-50 hover:opacity-100 transition-opacity" />
      </button>
    </div>
  )
}
