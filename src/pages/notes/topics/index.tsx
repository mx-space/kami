import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'

import type { TopicModel } from '@mx-space/api-client/types/models/topic'

import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { SEO } from '~/components/universal/Seo'
import { RightLeftTransitionView } from '~/components/universal/Transition/right-left'
import { apiClient } from '~/utils'

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
      <SEO title="专栏" />
      <div className="article-list">
        <ul>
          <TransitionGroup>
            {topics.map((topic) => (
              <RightLeftTransitionView key={topic.id} component={'li'}>
                <Link href={`/notes/topics/${topic.slug}`}>
                  <a>{topic.name}</a>
                </Link>
              </RightLeftTransitionView>
            ))}
          </TransitionGroup>
        </ul>
      </div>
    </ArticleLayout>
  )
}

export default TopicPage
