import Link from 'next/link'
import type { FC } from 'react'
import useSWR from 'swr'

import type { TopicModel } from '@mx-space/api-client'
import {
  Divider,
  DividerVertical,
} from '@mx-space/kami-design/components/Divider'
import {
  MdiClockOutline,
  MdiFountainPenTip,
} from '@mx-space/kami-design/components/Icons/for-note'

import { RelativeTime } from '~/components/universal/RelativeTime'
import { apiClient } from '~/utils/client'

import { NoteTopicMarkdownRender } from './markdown-render'

export const InnerTopicDetail: FC<{ topic: TopicModel }> = (props) => {
  const { topic } = props
  const { id: topicId } = topic

  const { data, isLoading } = useSWR(`topic-${topicId}`, () =>
    apiClient.note.getNoteByTopicId(topicId, 1, 1, {
      sortBy: 'created',
      sortOrder: -1,
    }),
  )

  return (
    <div className="flex flex-col w-[400px]">
      <Link href={`/notes/topics/${topic.slug}`}>
        <h1 className="text-lg font-medium !m-0 py-2">{topic.name}</h1>
      </Link>

      <p className="break-all line-clamp-2 text-gray-2">
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
        <p>获取中...</p>
      ) : (
        data?.data[0] && (
          <p className="flex items-center">
            <MdiClockOutline />
            <DividerVertical />
            <span className="flex-shrink-0">最近更新</span>
            <DividerVertical />
            <span className="flex-shrink inline-flex min-w-0">
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
            共有文章：
            {data?.pagination?.total} 篇
          </p>
        </>
      )}
    </div>
  )
}
