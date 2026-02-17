import type { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import type { NoteModel, Pager, TopicModel } from '@mx-space/api-client'

import { getLocaleFromContext, Link, useLocale } from '~/i18n/navigation'
import { setRequestLocale , apiClient } from '~/utils/client'
import { Seo } from '~/components/app/Seo'
import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { NoteTopicMarkdownRender } from '~/components/in-page/Note/NoteTopic/markdown-render'
import { TimelineListWrapper } from '~/components/in-page/Timeline/TimelineListWrapper'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { Divider } from '~/components/ui/Divider'
import { Pagination } from '~/components/ui/Pagination'
import { RightToLeftTransitionView } from '~/components/ui/Transition/RightToLeftTransitionView'

const TopicDetailPage: NextPage<TopicModel> = (props) => {
  const { name } = props
  const t = useTranslations('topic')
  const locale = useLocale()
  const [notes, setNotes] = useState<NoteModel[]>()
  const [pager, setPager] = useState<Pager>()

  const fetch = useCallback(
    (page = 1, size = 20) => {
      apiClient.note
        .getNoteByTopicId(props.id, page, size, { lang: locale })
        .then((res) => {
          const { data, pagination } = res
          setNotes(data)
          setPager(pagination)
        })
    },
    [locale, props.id],
  )
  useEffect(() => {
    fetch()
  }, [fetch])

  const handleChangePage = useCallback(
    (page: number) => {
      fetch(page)
    },
    [fetch],
  )

  return (
    <ArticleLayout
      title={t('columnTitle', { name })}
      subtitle={
        pager
          ? pager.total
            ? t('totalArticles', { count: pager.total })
            : t('empty')
          : ''
      }
    >
      <Seo title={`${t('title')} - ${name}`} />
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
  setRequestLocale(getLocaleFromContext(ctx))
  const { topicSlug } = ctx.query
  return await apiClient.topic.getTopicBySlug(topicSlug as string)
}
export default wrapperNextPage(TopicDetailPage)
