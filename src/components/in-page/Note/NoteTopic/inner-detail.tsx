import { Link } from '~/i18n/navigation'
import type { FC } from 'react'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'

import type { TopicModel } from '@mx-space/api-client'

import { RelativeTime } from '~/components/common/RelativeTime'
import { Divider, DividerVertical } from '~/components/ui/Divider'
import {
  MdiClockOutline,
  MdiFountainPenTip,
} from '~/components/ui/Icons/for-note'
import { apiClient } from '~/utils/client'

import { NoteTopicMarkdownRender } from './markdown-render'

export const InnerTopicDetail: FC<{ topic: TopicModel }> = (props) => {
  const { topic } = props
  const t = useTranslations('topic')
  const { id: topicId } = topic

  const { data, isLoading } = useSWR(`topic-${topicId}`, () =>
    apiClient.note.getNoteByTopicId(topicId, 1, 1, {
      sortBy: 'created',
      sortOrder: -1,
    }),
  )

  return (
    <div className="flex w-[400px] flex-col">
      <Link href={`/notes/topics/${topic.slug}`}>
        <h1 className="!m-0 py-2 text-lg font-medium">{topic.name}</h1>
      </Link>

      <p className="text-gray-2 line-clamp-2 break-all">
        <NoteTopicMarkdownRender>{topic.introduce}</NoteTopicMarkdownRender>
      </p>
      {topic.description && (
        <>
          <Divider />
          <p className="text-gray-1 leading-8">
            <NoteTopicMarkdownRender>
              {topic.description}
            </NoteTopicMarkdownRender>
          </p>
        </>
      )}

      <Divider />
      {isLoading ? (
        <p>{t('fetching')}</p>
      ) : (
        data?.data[0] && (
          <p className="flex items-center">
            <MdiClockOutline />
            <DividerVertical />
            <span className="flex-shrink-0">{t('recentUpdate')}</span>
            <DividerVertical />
            <span className="inline-flex min-w-0 flex-shrink">
              <Link
                href={`/data?.data/${data?.data[0].nid}`}
                className="truncate"
              >
                {data?.data[0]?.title}
              </Link>
              <span className="flex-shrink-0">
                （
                <RelativeTime
                  date={data?.data[0].modified || data?.data[0].created}
                  displayAbsoluteTimeAfterDay={Infinity}
                />
                ）
              </span>
            </span>
          </p>
        )
      )}

      {!isLoading && (
        <>
          <Divider />
          <p className="flex items-center">
            <MdiFountainPenTip />
            <DividerVertical />
            {t('totalCount')}
            {data?.pagination?.total} {t('articlesUnit')}
          </p>
        </>
      )}
    </div>
  )
}
