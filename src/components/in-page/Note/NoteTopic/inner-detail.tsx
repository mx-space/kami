import Link from 'next/link'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

import type { NoteModel, Pager } from '@mx-space/api-client'
import type { TopicModel } from '@mx-space/api-client/types/models/topic'
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

  const [notes, setNotes] = useState([] as NoteModel[])
  const [pagination, setPagination] = useState<Pager>()

  useEffect(() => {
    apiClient.note
      .getNoteByTopicId(topicId, 1, 1, {
        sortBy: 'created',
        sortOrder: -1,
      })
      .then((res) => {
        const { data, pagination } = res

        setNotes(data)
        setPagination(pagination)
      })
  }, [topicId])

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
      {notes[0] && (
        <>
          <Divider />
          <p className="flex items-center">
            <MdiClockOutline />
            <DividerVertical />
            <span className="flex-shrink-0">最近更新</span>
            <DividerVertical />
            <span className="flex-shrink inline-flex min-w-0">
              <Link href={`/notes/${notes[0].nid}`} className="truncate">
                {notes[0]?.title}
              </Link>
              <span className="flex-shrink-0">
                （
                <RelativeTime
                  date={notes[0].modified || notes[0].created}
                  displayAbsoluteTimeAfterDay={Infinity}
                />
                ）
              </span>
            </span>
          </p>
        </>
      )}
      <Divider />
      <p className="flex items-center">
        <MdiFountainPenTip />
        <DividerVertical />
        共有文章：
        {pagination?.total} 篇
      </p>
    </div>
  )
}
