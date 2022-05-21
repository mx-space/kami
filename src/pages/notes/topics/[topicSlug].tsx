import { ArticleLayout } from 'components/layouts/ArticleLayout'
import { Divider } from 'components/universal/Divider'
import { Pagination } from 'components/universal/Pagination'
import { SEO } from 'components/universal/Seo'
import { RightLeftTransitionView } from 'components/universal/Transition/right-left'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import Linkify from 'react-linkify'
import { TransitionGroup } from 'react-transition-group'
import { apiClient } from 'utils'

import type { NoteModel, Pager } from '@mx-space/api-client'
import type { TopicModel } from '@mx-space/api-client/types/models/topic'

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
      subtitle={pager ? `共收录${pager.total}篇文章` : ''}
    >
      <SEO title={`专栏 - ${name}`} />
      <div className="topic-info -mt-8">
        <p>
          <span>{props.introduce}</span>
        </p>
        {props.description && (
          <>
            <Divider />
            <p>
              <Linkify>{props.description}</Linkify>
            </p>
          </>
        )}
      </div>
      <div className="article-list mt-16">
        <ul>
          <TransitionGroup>
            {notes &&
              notes.map((note) => {
                const date = new Date(note.created)
                return (
                  <RightLeftTransitionView key={note.id}>
                    <li>
                      <Link href={`/notes/${note.nid}`}>
                        <a>{note.title}</a>
                      </Link>
                      <span className={'meta'}>
                        {(date.getMonth() + 1).toString().padStart(2, '0')}/
                        {date.getDate().toString().padStart(2, '0')}/
                        {date.getFullYear()}
                      </span>
                    </li>
                  </RightLeftTransitionView>
                )
              })}
          </TransitionGroup>
        </ul>
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
export default TopicDetailPage
