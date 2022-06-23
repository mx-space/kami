import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { apiClient } from 'utils/client'

import type { PostModel, TagModel } from '@mx-space/api-client'

import { JamTags } from '~/components/universal/Icons'
import { OverLay } from '~/components/universal/Overlay'
import { BigTag } from '~/components/universal/Tag'
import { BottomUpTransitionView } from '~/components/universal/Transition/bottom-up'
import { RightLeftTransitionView } from '~/components/universal/Transition/right-left'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { store } from '~/store'
import { NoSSRWrapper } from '~/utils/no-ssr'

const _FloatPostTagButton: FC = observer(() => {
  const { actionStore, appUIStore } = store
  const [showTags, setShowTags] = useState(false)
  const [postWithTag, setTagPost] = useState<
    Pick<PostModel, 'id' | 'title' | 'slug' | 'created' | 'category'>[]
  >([])
  const fetchPostsWithTag = useCallback(async (tagName: string) => {
    setTagPost(null!)

    const { data: posts } = await apiClient.category.getTagByName(tagName)

    setTagPost(posts)
  }, [])

  const [tags, setTags] = useState<TagModel[]>([])
  const fetchTags = async () => {
    const { data: tags } = await apiClient.category.getAllTags()

    setTags(tags)
  }
  const idSymbol = useRef(Symbol())
  const { event } = useAnalyze()
  useEffect(() => {
    actionStore.removeActionBySymbol(idSymbol.current)
    const action = {
      icon: <JamTags />,
      id: idSymbol.current,
      onClick: () => {
        if (tags.length == 0) {
          fetchTags()
        }
        setShowTags(true)

        event({
          action: TrackerAction.Click,
          label: '标签 FAB 点击',
        })
      },
    }
    requestAnimationFrame(() => {
      actionStore.appendActions(action)
    })

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      actionStore.removeActionBySymbol(idSymbol.current)
    }
  }, [tags.length])

  return (
    <OverLay
      show={showTags}
      onClose={() => {
        setShowTags(false)
        setTagPost([])
      }}
    >
      <div
        style={{
          maxWidth:
            appUIStore.viewport.w > 800 ? '50vw' : 'calc(100vw - 100px)',
        }}
        className="m-auto relative h-full"
        onClick={() => {
          setShowTags(false)
          setTagPost([])
        }}
      >
        <div className="absolute z-[3] bottom-[50vh] top-[100px]">
          <TransitionGroup className="flex items-end flex-wrap">
            {tags.map(({ name }, i) => {
              return (
                <BottomUpTransitionView
                  appear
                  unmountOnExit
                  key={name}
                  className="pr-4"
                  timeout={{ enter: 50 * i }}
                >
                  <BigTag
                    tagName={name}
                    onClick={(e) => {
                      e.stopPropagation()
                      fetchPostsWithTag(name)
                    }}
                  />
                </BottomUpTransitionView>
              )
            })}
          </TransitionGroup>
        </div>

        <div className="top-[50vh] absolute">
          <article className="article-list !all:text-light-400">
            <ul>
              <TransitionGroup>
                {postWithTag ? (
                  postWithTag.map((child, i) => {
                    const date = new Date(child.created)

                    return (
                      <RightLeftTransitionView
                        key={child.id}
                        timeout={{ enter: 50 * i }}
                      >
                        <li>
                          <Link
                            href={'/posts/[category]/[slug]'}
                            as={`/posts/${child.category.slug}/${child.slug}`}
                          >
                            <a>{child.title}</a>
                          </Link>
                          <span className={'meta'}>
                            {Intl.DateTimeFormat('en-US').format(date)}
                          </span>
                        </li>
                      </RightLeftTransitionView>
                    )
                  })
                ) : (
                  <RightLeftTransitionView timeout={100}>
                    <span>载入中.</span>
                  </RightLeftTransitionView>
                )}
              </TransitionGroup>
            </ul>
          </article>
        </div>
      </div>
    </OverLay>
  )
})

export const TagFAB = NoSSRWrapper(_FloatPostTagButton)
