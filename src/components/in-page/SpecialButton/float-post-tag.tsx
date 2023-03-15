import Link from 'next/link'
import type { FC } from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { apiClient } from 'utils/client'

import type { PostModel, TagModel } from '@mx-space/api-client'
import { JamTags } from '@mx-space/kami-design/components/Icons/layout'
import { Overlay } from '@mx-space/kami-design/components/Overlay'
import { BottomUpTransitionView } from '@mx-space/kami-design/components/Transition/bottom-up'
import { RightLeftTransitionView } from '@mx-space/kami-design/components/Transition/right-left'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { withNoSSR } from '~/components/biz/HoC/no-ssr'
import { BigTag } from '~/components/universal/Tag'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'

const TagsContainer: FC<{ children?: JSX.Element[]; onClick: () => any }> = ({
  onClick,
  children,
}) => {
  const w = useAppStore((state) => state.viewport.w)

  return (
    <div
      style={{
        maxWidth: w > 800 ? '50vw' : 'calc(100vw - 100px)',
      }}
      className="m-auto h-screen w-screen absolute inset-0"
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const _FloatPostTagButton: FC = memo(() => {
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
  const actionId = useRef('tag')
  const { event } = useAnalyze()
  useEffect(() => {
    const actionStore = useActionStore.getState()
    actionStore.removeActionById(actionId.current)
    const action = {
      icon: <JamTags />,
      id: actionId.current,
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
      actionStore.removeActionById(actionId.current)
    }
  }, [tags.length])
  const onTagContainerClick = useCallback(() => {
    setShowTags(false)
    setTagPost([])
  }, [])

  return (
    <Overlay
      center={false}
      show={showTags}
      blur
      darkness={0.5}
      onClose={() => {
        setShowTags(false)
        setTagPost([])
      }}
    >
      <TagsContainer onClick={onTagContainerClick}>
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
          <article className="article-list text-shizuku-text">
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
                            {child.title}
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
                    <span>载入中...</span>
                  </RightLeftTransitionView>
                )}
              </TransitionGroup>
            </ul>
          </article>
        </div>
      </TagsContainer>
    </Overlay>
  )
})

export const TagFAB = withNoSSR(_FloatPostTagButton)
