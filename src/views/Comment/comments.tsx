import { CommentModel } from '@mx-space/api-client'
import { EventTypes } from 'common/socket/types'
import { Id } from 'common/store/helper/structure'
import QueueAnim from 'rc-queue-anim'
import {
  createElement,
  FC,
  Fragment,
  memo,
  useContext,
  useEffect,
  useState,
} from 'react'
import { eventBus } from 'utils'
import { apiClient } from 'utils/client'
import { message } from 'utils/message'
import { Markdown } from 'views/Markdown'
import { CommentContext, minHeightProperty, openCommentMessage } from '.'
import { useStore } from '../../common/store'
import { animatingClassName } from '../../layouts/NoteLayout'
import { Avatar } from './avatar'
import { CommentBox } from './box'
import { Comment } from './comment'
import { Empty } from './empty'
import { getCommentWrap } from './helper'
import styles from './index.module.css'

interface CommentsProps {
  comments: CommentModel[]
  onFetch: (page?: number, size?: number, force?: boolean) => void
  id: string
}

export const Comments: FC<CommentsProps> = memo((props) => {
  if (props.comments.length === 0) {
    return <Empty />
  }

  return createElement(CommentList, props)
})

const CommentList: FC<CommentsProps> = memo(
  ({ comments: c, onFetch: fetchComments, id }) => {
    const [comments, setComments] = useState(c)
    const { refresh, collection } = useContext(CommentContext)
    const [replyId, setReplyId] = useState('')
    const { userStore } = useStore()
    const logged = userStore.isLogged

    const [sure, setSure] = useState<null | Id>(null)

    // observer gateway event

    useEffect(() => {
      const handler = (data: CommentModel & { ref: string }) => {
        // insert new comment to head
        if (data.ref === id) {
          if (!data.parent) {
            setComments((prev) => {
              prev.unshift(data)
              return [...prev]
            })
          } else {
            const clone = [...comments]

            const index = clone.findIndex((comment) => {
              return comment.id === (data.parent as any as CommentModel).id
            })

            if (index !== -1) {
              if (!Array.isArray(clone[index].children)) {
                clone[index].children = [data]
              } else {
                clone[index].children.unshift(data)
              }
              setComments(clone)
            } else {
              // deep scan
              clone.some((comment) => {
                if (
                  Array.isArray(comment.children) &&
                  comment.children.length
                ) {
                  return search(
                    comment.children,
                    data as any as CommentModel,
                    data,
                  )
                }
              })

              setComments(clone)
            }
          }
        }
      }
      eventBus.on(EventTypes.COMMENT_CREATE, handler)

      return () => eventBus.off(EventTypes.COMMENT_CREATE, handler)
    }, [comments, id])

    useEffect(() => {
      setComments(c)
    }, [c])

    const renderSingleComment = (
      comment: CommentModel,
      children?: JSX.Element | JSX.Element[],
    ) => {
      const handleReply = async (model) => {
        openCommentMessage()
        if (logged) {
          await apiClient.comment.proxy.master
            .reply(comment.id)
            .post({ data: model })
        } else {
          await apiClient.comment.reply(comment.id, model)
        }
        openCommentMessage.success()
        refresh()
        setReplyId('')
      }
      const handleDelete = (id: string) => async () => {
        await apiClient.comment.proxy(id).delete()

        message.success('删除成功~')
        fetchComments(undefined, undefined, true)
      }
      const getUrl = () => {
        try {
          const host = new URL(comment.url || '').host
          return '//' + host
        } catch {
          return undefined
        }
      }
      const url = getUrl()

      return (
        <Comment
          key={comment.id}
          data-comment-id={comment.id}
          author={
            <a href={url} rel={'nofollow'}>
              {comment.author}
            </a>
          }
          avatar={<Avatar src={comment.avatar} />}
          content={
            <Markdown
              value={`${
                comment.parent
                  ? `@${
                      collection.get(comment.parent as any as string)?.id ??
                      (comment.parent as any as CommentModel)?.id ??
                      ''
                    } `
                  : ''
              }${comment.text}`}
              className={styles['comment']}
              skipHtml
              escapeHtml
              renderers={{
                commentAt: ({ value }) => {
                  const comment =
                    typeof value === 'string' ? collection.get(value) : value
                  if (!comment) {
                    return null
                  }

                  return (
                    <a
                      href={'javascript:;'}
                      className={styles['comment-at']}
                      onMouseOver={(e) => {
                        e.stopPropagation()
                        const $parent = getCommentWrap(comment)

                        if (!$parent) {
                          return
                        }
                        // $parent.classList.add('highlight')
                        $parent.getAnimations?.().forEach((i) => i.cancel())
                        const animate = $parent.animate(
                          [
                            {
                              backgroundColor: 'transparent',
                            },
                            {
                              backgroundColor: '#FFEBC9ee',
                            },
                          ],
                          {
                            duration: 1000,
                            iterations: Infinity,
                            direction: 'alternate',
                            easing: 'linear',
                            fill: 'both',
                          },
                        )

                        if (typeof $parent.getAnimations === 'undefined') {
                          $parent.getAnimations = () => {
                            return [animate]
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation()
                        const $parent = getCommentWrap(comment)

                        if (!$parent) {
                          return
                        }
                        // $parent.classList.add('highlight')

                        // support only Chrome >= 79 (behind the Experimental Web Platform Features preference)
                        $parent.getAnimations?.().forEach((a) => a.cancel())
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        const $parent = getCommentWrap(comment)
                        if (!$parent) {
                          return
                        }
                        $parent.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                        })
                        $parent.animate([
                          {
                            backgroundColor: '#FFEBC9',
                          },
                          {
                            backgroundColor: 'transparent',
                          },
                        ])
                      }}
                    >
                      @{comment.author}
                    </a>
                  )
                },
              }}
            />
          }
          datetime={comment.created}
          commentKey={comment.key}
          actions={[
            <span
              key="comment-list-reply-to-0"
              onClick={() => {
                if (replyId !== comment.id) setReplyId(comment.id)
                else setReplyId('')
              }}
            >
              {replyId !== comment.id ? '回复' : '取消回复'}
            </span>,
            logged ? (
              <Fragment>
                {sure !== comment.id && (
                  <span
                    key="comment-list-delete"
                    onClick={() => {
                      setSure(comment.id)
                      setTimeout(() => {
                        try {
                          setSure(null)
                          // eslint-disable-next-line no-empty
                        } catch {}
                      }, 8000)
                    }}
                  >
                    删除
                  </span>
                )}
                {sure === comment.id && (
                  <span
                    key="comment-list-delete"
                    onClick={() => {
                      handleDelete(comment.id)()
                      setSure(null)
                    }}
                    style={{ color: '#e74c3c' }}
                  >
                    真的需要删除?
                  </span>
                )}
              </Fragment>
            ) : null,
          ]}
        >
          <QueueAnim
            appear
            forcedReplay
            leaveReverse
            type={'bottom'}
            duration={500}
          >
            {replyId === comment.id && (
              <CommentBox
                autoFocus
                key={'box'}
                onSubmit={handleReply}
                onCancel={() => setReplyId('')}
              />
            )}
          </QueueAnim>

          {children}
        </Comment>
      )
    }
    const renderComments = (comment: CommentModel) => {
      if (comment.children.length > 0) {
        const children = comment.children
        const childComments = children.map((child: CommentModel) => {
          return renderComments(child)
        })

        return renderSingleComment(comment, childComments)
      }
      return renderSingleComment(comment)
    }

    return (
      <QueueAnim
        delay={300}
        duration={500}
        animConfig={{ opacity: [1, 0], translateY: [0, 50] }}
        animatingClassName={animatingClassName}
        style={{ ...minHeightProperty }}
      >
        <div key={comments.length} id={'comments-wrap'}>
          {comments.map((comment) => {
            return renderComments(comment)
          })}
        </div>
      </QueueAnim>
    )
  },
)

// ???????? WTF what this??????????
function search(
  children: CommentModel[],
  searched: CommentModel,
  insertData: CommentModel,
) {
  children.some((comment) => {
    if (Array.isArray(comment.children) && comment.children.length) {
      return search(comment.children, searched, insertData)
    }

    if (comment.id === (searched.parent as any as CommentModel).id) {
      if (!Array.isArray(comment.children)) {
        comment.children = [insertData]
      } else {
        comment.children.unshift(insertData)
      }

      return true
    }
    return false
  })
}
