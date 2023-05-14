import type { FC } from 'react'

import type { SubscribeTypeToBitMap } from '@mx-space/api-client'

import { TablerBellRinging } from '~/components/ui/Icons/shared'

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
    <div className="mb-6 flex justify-center">
      <button
        className="flex flex-col items-center justify-center p-4"
        onClick={present}
      >
        <p className="text-gray-1 leading-8 opacity-80">
          站点已开启邮件订阅，点亮小铃铛，订阅最新文章哦~
        </p>

        <TablerBellRinging className="text-accent mt-4 scale-150 transform text-3xl opacity-50 transition-opacity hover:opacity-100" />
      </button>
    </div>
  )
}
