import { Avatar } from 'components/universal/Avatar'
import { FloatPopover } from 'components/universal/FloatPopover'
import { ImpressionView } from 'components/universal/ImpressionView'
import { TrackerAction } from 'constants/tracker'
import type { FC} from 'react';
import { useMemo } from 'react'
import { textToBigCharOrWord } from 'utils/word'

import type { TopicModel } from '@mx-space/api-client/types/models/topic'

export const NoteTopic: FC<{ noteId: string; topic: TopicModel }> = (props) => {
  const { topic } = props
  const { icon, name, introduce } = topic
  return (
    <ImpressionView
      action={TrackerAction.Impression}
      trackerMessage={`曝光底部话题 - ${topic.name}`}
    >
      <div data-hide-print>
        <div className="text-md">
          <strong>文章被专栏收录：</strong>
        </div>
        <hr className="border-0 h-[0.5px] my-4 !bg-opacity-20 bg-black dark:bg-white " />
        <div className="flex items-center gap-4">
          <Avatar
            size={60}
            imageUrl={icon}
            text={textToBigCharOrWord(name)}
            className="flex-shrink-0"
            useRandomColor={false}
            shadow={false}
            wrapperProps={useMemo(
              () => ({ className: 'text-white dark:text-opacity-80' }),
              [],
            )}
          />
          <div className="flex-grow flex flex-col self-start">
            <span className="text-md font-medium mb-2">
              <FloatPopover triggerComponent={() => <span>{name}</span>}>
                <div className="text-sm">{introduce}</div>
              </FloatPopover>
            </span>

            <p className="opacity-60 text-shizuku-text text-sm line-clamp-2">
              {introduce}
            </p>
          </div>
        </div>
      </div>
    </ImpressionView>
  )
}
