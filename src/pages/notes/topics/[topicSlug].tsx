import type { NextPage } from 'next'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import type { NoteModel, Pager, TopicModel } from '@mx-space/api-client'

import { Seo } from '~/components/app/Seo'
import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { NoteTopicMarkdownRender } from '~/components/in-page/Note/NoteTopic/markdown-render'
import { TimelineListWrapper } from '~/components/in-page/Timeline/TimelineListWrapper'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { Divider } from '~/components/ui/Divider'
import { Pagination } from '~/components/ui/Pagination'
import { RightToLeftTransitionView } from '~/components/ui/Transition/RightToLeftTransitionView'
import { apiClient } from '~/utils/client'

const TopicDetailPage: NextPage<TopicModel> = (props) => {
  const { name } = props

  const [notes, setNotes] = useState<NoteModel[]>()
  const [pager, setPager] = useState<Pager>()

  const fetch = (page = 1, size = 20) => {
    apiClient.note.getNoteByTopicId(props.id, page, size).then((res) => {
      const { data, pagination } = res
      setNotes(data)
      setPager(pagination)
    })
  }
  useEffect(() => {
    fetch()
  }, [])

  const handleChangePage = useCallback((page: number) => {
    fetch(page)
  }, [])

  return (
    <ArticleLayout
      title={`专栏 · ${name}`}
      subtitle={
        pager
          ? pager.total
            ? `共收录${pager.total}篇文章`
            : '这里还没有收录任何内容哦'
          : ''
      }
    >
      <Seo title={`专栏 - ${name}`} />
      <div className="topic-info -mt-8">
        <p className="leading-6">{props.introduce}</p>
        {props.description && (
          <>
            <Divider />
            <NoteTopicMarkdownRender>
              {props.description}
            </NoteTopicMarkdownRender>
          </>
        )}
      </div>
      <div className="article-list mt-16">
        <TimelineListWrapper>
          {notes &&
            notes.map((note) => {
              const date = new Date(note.created)
              return (
                <RightToLeftTransitionView
                  key={note.id}
                  as="li"
                  className="flex min-w-0 items-center justify-between"
                >
                  <Link
                    href={`/notes/${note.nid}`}
                    target="_blank"
                    className="truncate"
                  >
                    {note.title}
                  </Link>
                  <span className="meta">
                    {(date.getMonth() + 1).toString().padStart(2, '0')}/
                    {date.getDate().toString().padStart(2, '0')}/
                    {date.getFullYear()}
                  </span>
                </RightToLeftTransitionView>
              )
            })}
        </TimelineListWrapper>

        {pager && (
          <Pagination
            current={pager.currentPage}
            onChange={handleChangePage}
            total={pager.totalPage}
          />
        )}
      </div>
    </ArticleLayout>
  )
}
TopicDetailPage.getInitialProps = async (ctx) => {
  const { topicSlug } = ctx.query
  return await apiClient.topic.getTopicBySlug(topicSlug as string)
}
export default wrapperNextPage(TopicDetailPage)
