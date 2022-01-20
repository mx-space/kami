import { faTags } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PostModel, TagModel } from '@mx-space/api-client'
import { QueueAnim } from 'components/universal/Anime'
import { OverLay } from 'components/universal/Overlay'
import { BigTag } from 'components/universal/Tag'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { store } from 'store'
import { apiClient, NoSSR } from 'utils'

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
  useEffect(() => {
    actionStore.removeActionBySymbol(idSymbol.current)
    const action = {
      icon: <FontAwesomeIcon icon={faTags} />,
      id: idSymbol.current,
      onClick: () => {
        if (tags.length == 0) {
          fetchTags()
        }
        setShowTags(true)
      },
    }
    requestAnimationFrame(() => {
      actionStore.appendActions(action)
    })

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      actionStore.removeActionBySymbol(idSymbol.current)
    }
  }, [actionStore, tags.length])

  return (
    <OverLay
      darkness={0.6}
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
          <QueueAnim type="bottom" className="flex items-end flex-wrap">
            {tags.map(({ name }) => {
              return (
                <BigTag
                  tagName={name}
                  key={name}
                  onClick={(e) => {
                    e.stopPropagation()
                    fetchPostsWithTag(name)
                  }}
                />
              )
            })}
          </QueueAnim>
        </div>

        <div className="top-[50vh] absolute">
          <article className="post-content kami-note article-list !all:text-light-400">
            <ul>
              <QueueAnim delay={700} forcedReplay appear>
                {postWithTag ? (
                  postWithTag.map((child) => {
                    const date = new Date(child.created)

                    return (
                      <li key={child.id}>
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
                    )
                  })
                ) : (
                  <span>载入中.</span>
                )}
              </QueueAnim>
            </ul>
          </article>
        </div>
      </div>
    </OverLay>
  )
})

export const FloatPostTagButton = NoSSR(_FloatPostTagButton)
