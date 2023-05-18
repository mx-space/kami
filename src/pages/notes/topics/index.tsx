import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { TopicModel } from '@mx-space/api-client'

import { Seo } from '~/components/app/Seo'
import { TimelineListWrapper } from '~/components/in-page/Timeline/TimelineListWrapper'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { RightToLeftTransitionView } from '~/components/ui/Transition/RightToLeftTransitionView'
import { apiClient } from '~/utils/client'

// TODO
const TopicPage: NextPage = () => {
  const [topics, setTopics] = useState([] as TopicModel[])
  useEffect(() => {
    apiClient.topic.getAll().then((res) => {
      setTopics(res.data)
    })
  }, [])
  return (
    <ArticleLayout title="专栏">
      <Seo title="专栏" />
      <div className="article-list">
        <TimelineListWrapper>
          {topics.map((topic) => (
            <RightToLeftTransitionView key={topic.id} as="li">
              <Link href={`/notes/topics/${topic.slug}`}>{topic.name}</Link>
            </RightToLeftTransitionView>
          ))}
        </TimelineListWrapper>
      </div>
    </ArticleLayout>
  )
}

export default TopicPage
