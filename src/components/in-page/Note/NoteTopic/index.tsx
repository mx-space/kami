import Link from 'next/link'
import type { FC } from 'react'
import { useCallback, useMemo } from 'react'
import Linkify from 'react-linkify'

import type { TopicModel } from '@mx-space/api-client/types/models/topic'

import { ImpressionView } from '~/components/biz/ImpressionView'
import { Avatar } from '~/components/universal/Avatar'
import { Divider } from '~/components/universal/Divider'
import { FloatPopover } from '~/components/universal/FloatPopover'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { textToBigCharOrWord } from '~/utils/word'

import { InnerTopicDetail } from './inner-detail'

export const NoteTopic: FC<{ noteId: string; topic: TopicModel }> = (props) => {
  const { topic } = props
  const { icon, name, introduce } = topic

  const { event } = useAnalyze()
  const handleTrackerClick = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: `话题点击 进入详情 / ${name}`,
    })
  }, [name])

  return (
    <ImpressionView
      action={TrackerAction.Impression}
      trackerMessage={`曝光底部话题 - ${topic.name}`}
    >
      <div data-hide-print>
        <div className="text-md">
          <strong>文章被专栏收录：</strong>
        </div>
        <Divider />
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
              <FloatPopover
                strategy="absolute"
                triggerComponent={() => (
                  <Link
                    href={`/notes/topics/${topic.slug}`}
                    onClick={handleTrackerClick}
                  >
                    <a>
                      <span>{name}</span>
                    </a>
                  </Link>
                )}
              >
                <ImpressionView
                  trackerMessage={`曝光 - 内页话题 - ${topic.name}`}
                  action={TrackerAction.Impression}
                >
                  <InnerTopicDetail topic={topic} />
                </ImpressionView>
              </FloatPopover>
            </span>

            <p className="opacity-80 text-shizuku-text text-sm line-clamp-2">
              <Linkify>{introduce}</Linkify>
            </p>
          </div>
        </div>
      </div>
    </ImpressionView>
  )
}
