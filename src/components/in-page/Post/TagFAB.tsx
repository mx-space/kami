'use client'

import { Link } from '~/i18n/navigation'
import type { FC } from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import type { PostModel, TagModel } from '@mx-space/api-client'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { withNoSSR } from '~/components/app/HoC/no-ssr'
import { JamTags } from '~/components/ui/Icons/layout'
import { Overlay } from '~/components/ui/Overlay'
import { BigTag } from '~/components/ui/Tag'
import { BottomToUpTransitionView } from '~/components/ui/Transition/BottomToUpTransitionView'
import { RightToLeftTransitionView } from '~/components/ui/Transition/RightToLeftTransitionView'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { apiClient } from '~/utils/client'

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
      className="absolute inset-0 m-auto h-screen w-screen"
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const _TagFAB: FC = memo(() => {
  const t = useTranslations('common')
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
        <div className="z-3 absolute bottom-[50vh] top-[100px] overflow-auto">
          <div className="flex flex-wrap items-end">
            {tags.map(({ name }, i) => {
              return (
                <BottomToUpTransitionView
                  appear
                  key={name}
                  className="mb-4 pr-4"
                  timeout={{ enter: 50 * i }}
                >
                  <BigTag
                    tagName={name}
                    onClick={(e) => {
                      e.stopPropagation()
                      fetchPostsWithTag(name)
                    }}
                  />
                </BottomToUpTransitionView>
              )
            })}
          </div>
        </div>

        <div className="absolute top-[50vh]">
          <article className="article-list text-shizuku-text">
            <ul className="">
              {postWithTag ? (
                postWithTag.map((child, i) => {
                  const date = new Date(child.created)

                  return (
                    <RightToLeftTransitionView
                      key={child.id}
                      timeout={{ enter: 50 * i }}
                      useAnimatePresence={false}
                      as="li"
                      className="!children:text-always-white"
                    >
                      <Link
                        className="!hover:border-b-always-white"
                        href={`/posts/${child.category.slug}/${child.slug}`}
                      >
                        {child.title}
                      </Link>
                      <span className="meta">
                        {Intl.DateTimeFormat('en-US').format(date)}
                      </span>
                    </RightToLeftTransitionView>
                  )
                })
              ) : (
                <RightToLeftTransitionView>
                  <span>{t('loading')}</span>
                </RightToLeftTransitionView>
              )}
            </ul>
          </article>
        </div>
      </TagsContainer>
    </Overlay>
  )
})

export const TagFAB = withNoSSR(_TagFAB)
