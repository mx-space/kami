import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'

import type { TopicModel } from '@mx-space/api-client'

import { Seo } from '~/components/common/Seo'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { RightLeftTransitionView } from '~/components/ui/Transition/right-left'
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
        <ul>
          <TransitionGroup>
            {topics.map((topic) => (
              <RightLeftTransitionView key={topic.id} component="li">
                <Link href={`/notes/topics/${topic.slug}`}>{topic.name}</Link>
              </RightLeftTransitionView>
            ))}
          </TransitionGroup>
        </ul>
      </div>
    </ArticleLayout>
  )
}

export default TopicPage
