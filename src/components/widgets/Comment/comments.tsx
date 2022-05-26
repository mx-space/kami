import { Markdown } from 'components/universal/Markdown'
import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { Fragment, createElement, useEffect, useMemo, useState } from 'react'
import { message } from 'react-message-popup'
import client from 'socket'
import type { Id } from 'store/helper/structure'
import { EventTypes } from 'types/events'
import { eventBus } from 'utils'
import { apiClient } from 'utils/client'

import type { CommentModel } from '@mx-space/api-client'

import { openCommentMessage } from '.'
import { useStore } from '../../../store'
import { Avatar } from './avatar'
import { CommentBox } from './box'
import { Comment } from './comment'
import { Empty } from './empty'
import { getCommentWrap } from './helper'
import styles from './index.module.css'

interface CommentsProps {
  id: string
}

export const Comments: FC<CommentsProps> = observer((props) => {
  const { commentStore } = useStore()
  const { comments } = commentStore
  if (comments.length === 0) {
    return <Empty />
  }

  return createElement(CommentList, props)
})

const CommentList: FC<CommentsProps> = observer(({ id }) => {
  const { commentStore } = useStore()
  const { comments } = commentStore

  // observer gateway event

  useEffect(() => {
    const handler = (data: CommentModel) => {
      const isSubComment =
        data.parent &&
        ((typeof data.parent === 'string' &&
          commentStore.data.has(data.parent)) ||
          commentStore.data.has((data.parent as CommentModel)?.id))

      if (isSubComment) {
        const parentComment = commentStore.data.get(
          typeof data.parent === 'string' ? data.parent : data.parent?.id || '',
        )

        if (parentComment) {
          // TODO
          commentStore.updateComment({
            ...parentComment,
            children: [...parentComment.children, data],
          })
        }
      } else {
        commentStore.addComment(data)
      }
    }
    eventBus.on(EventTypes.COMMENT_CREATE, handler)

    return () => eventBus.off(EventTypes.COMMENT_CREATE, handler)
  }, [id])

  return (
    <BottomUpTransitionView
      appear
      id={'comments-wrap'}
      timeout={useMemo(() => ({ appear: 300, enter: 500 }), [])}
    >
      <div id={'comments-wrap'}>
        {comments.map((comment) => {
          return <InnerCommentList id={comment.id} key={comment.id} />
        })}
      </div>
    </BottomUpTransitionView>
  )
})

const SingleComment: FC<{ id: string }> = observer(({ id, children }) => {
  const [replyId, setReplyId] = useState('')
  const { userStore } = useStore()
  const logged = userStore.isLogged

  const { commentStore } = useStore()
  const { commentIdMap, fetchComment, currentRefId } = commentStore

  const comment = commentIdMap.get(id)!

  const [sure, setSure] = useState<null | Id>(null)

  const handleReply = async (model) => {
    const { success, error } = await openCommentMessage()
    try {
      if (logged) {
        await apiClient.comment.proxy.master
          .reply(comment.id)
          .post({ data: model })
      } else {
        await apiClient.comment.reply(comment.id, model)
      }
      success()

      if (client.socket.connected) {
        return
      } else {
        fetchComment(currentRefId)
      }
      setReplyId('')
    } catch (err) {
      error()
      console.error(err)
    }
  }
  const handleDelete = (id: string) => async () => {
    await apiClient.comment.proxy(id).delete()

    message.success('删除成功~')
    // TODO
  }
  const getUrl = () => {
    try {
      const host = new URL(comment.url || '').host
      return `//${host}`
    } catch {
      return undefined
    }
  }
  const url = getUrl()

  return (
    <Comment
      // @ts-expect-error
      location={comment.location}
      key={comment.id}
      data-comment-id={comment.id}
      id={`comments-${comment.key}`}
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
                  commentIdMap.get(comment.parent as any as string)?.id ??
                  (comment.parent as any as CommentModel)?.id ??
                  ''
                } `
              : ''
          }${comment.text}`}
          className={styles['comment']}
          skipHtml
          escapeHtml
          disallowedTypes={[
            'html',
            'virtualHtml',
            'linkReference',
            'imageReference',
            'table',
            'tableBody',
            'tableCell',
            'tableHead',
            'tableRow',
            'emphasis',
            'thematicBreak',
            'heading',
          ]}
          renderers={{
            commentAt: ({ value }) => {
              const comment =
                typeof value === 'string' ? commentIdMap.get(value) : value
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
                key="comment-list-delete text-red"
                onClick={() => {
                  handleDelete(comment.id)()
                  setSure(null)
                }}
              >
                真的需要删除?
              </span>
            )}
          </Fragment>
        ) : null,
      ]}
    >
      {replyId === comment.id && (
        <CommentBox
          autoFocus
          key={'box'}
          onSubmit={handleReply}
          onCancel={() => setReplyId('')}
        />
      )}

      {children}
    </Comment>
  )
})
const InnerCommentList = observer<{ id: string }>(({ id }) => {
  const { commentStore } = useStore()
  const { commentIdMap } = commentStore

  const comment = commentIdMap.get(id)

  if (!comment) {
    return null
  }
  if (comment.children.length > 0) {
    const children = comment.children
    const childComments = children.map((child: CommentModel) => {
      return <InnerCommentList id={child.id} key={child.id} />
    })

    return (
      <SingleComment key={comment.id} id={comment.id}>
        {childComments}
      </SingleComment>
    )
  }
  return <SingleComment id={comment.id} key={comment.id} />
})
