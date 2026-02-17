import { Link } from '~/i18n/navigation'
import type { FC } from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'

import type { TopicModel } from '@mx-space/api-client'

import { ImpressionView } from '~/components/common/ImpressionView'
import { Avatar } from '~/components/ui/Avatar'
import { Divider } from '~/components/ui/Divider'
import { FloatPopover } from '~/components/ui/FloatPopover'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { textToBigCharOrWord } from '~/utils/word'

import { InnerTopicDetail } from './inner-detail'
import { NoteTopicMarkdownRender } from './markdown-render'

export const NoteTopic: FC<{ noteId: string; topic: TopicModel }> = (props) => {
  const { topic } = props
  const t = useTranslations('topic')
  const { icon, name, introduce } = topic

  const { event } = useAnalyze()
  const handleTrackerClick = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: t('goToTopic', { name }),
    })
  }, [name, t])

  return (
    <ImpressionView
      action={TrackerAction.Impression}
      trackerMessage={`曝光底部话题 - ${topic.name}`}
    >
      <div data-hide-print>
        <div className="text-md">
          <strong>{t('articleInColumn')}</strong>
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
          <div className="flex flex-grow flex-col self-start">
            <span className="text-md mb-2 font-medium">
              <FloatPopover
                strategy="absolute"
                triggerComponent={() => (
                  <Link
                    href={`/notes/topics/${topic.slug}`}
                    onClick={handleTrackerClick}
                  >
                    <span>{name}</span>
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

            <p className="text-shizuku-text line-clamp-2 text-sm opacity-80">
              <NoteTopicMarkdownRender>{introduce}</NoteTopicMarkdownRender>
            </p>
          </div>
        </div>
      </div>
    </ImpressionView>
  )
}
