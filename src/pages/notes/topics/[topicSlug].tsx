import type { NextPage } from 'next'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'

import type { NoteModel, Pager, TopicModel } from '@mx-space/api-client'
import { Divider } from '@mx-space/kami-design/components/Divider'
import { RightLeftTransitionView } from '@mx-space/kami-design/components/Transition/right-left'

import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { Seo } from '~/components/biz/Seo'
import { TimelineListWrapper } from '~/components/biz/TimelineListWrapper'
import { NoteTopicMarkdownRender } from '~/components/in-page/Note/NoteTopic/markdown-render'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { Pagination } from '~/components/universal/Pagination'
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
        <TransitionGroup component={TimelineListWrapper}>
          {notes &&
            notes.map((note) => {
              const date = new Date(note.created)
              return (
                <RightLeftTransitionView
                  key={note.id}
                  component={'li'}
                  className="min-w-0 flex items-center justify-between"
                >
                  <Link
                    href={`/notes/${note.nid}`}
                    target="_blank"
                    className="truncate"
                  >
                    {note.title}
                  </Link>
                  <span className={'meta'}>
                    {(date.getMonth() + 1).toString().padStart(2, '0')}/
                    {date.getDate().toString().padStart(2, '0')}/
                    {date.getFullYear()}
                  </span>
                </RightLeftTransitionView>
              )
            })}
        </TransitionGroup>

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
