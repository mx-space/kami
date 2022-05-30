import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { Fragment, createElement, useCallback, useMemo, useState } from 'react'
import type ReactMarkdown from 'react-markdown'
import { message } from 'react-message-popup'
import { socketClient } from 'socket'

import type { CommentModel } from '@mx-space/api-client'

import { Markdown } from '~/components/universal/Markdown'
import { BottomUpTransitionView } from '~/components/universal/Transition/bottom-up'
import type { Id } from '~/store/helper/structure'
import { apiClient } from '~/utils/client'

import { openCommentMessage } from '.'
import { useStore } from '../../../store'
import { Avatar } from './avatar'
import { CommentBox } from './box'
import { Comment } from './comment'
import { Empty } from './empty'
import styles from './index.module.css'
import { CommentAtRender } from './renderers/comment-at'

export const Comments: FC = observer(() => {
  const { commentStore } = useStore()
  const { comments } = commentStore
  if (comments.length === 0) {
    return <Empty />
  }

  return createElement(CommentList)
})

const CommentList: FC = observer(() => {
  const { commentStore } = useStore()
  const { comments } = commentStore

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

const disallowedTypes: ReactMarkdown.NodeType[] = [
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
]

const SingleComment: FC<{ id: string }> = observer(({ id, children }) => {
  const [replyId, setReplyId] = useState('')
  const { userStore } = useStore()
  const logged = userStore.isLogged

  const { commentStore } = useStore()
  const { commentIdMap } = commentStore

  const comment = commentIdMap.get(id)!

  const [sure, setSure] = useState<null | Id>(null)

  const handleReply = useCallback(
    async (model) => {
      const { success, error } = await openCommentMessage()
      try {
        let data: CommentModel
        if (logged) {
          data = await apiClient.comment.proxy.master
            .reply(comment.id)
            .post({ data: model })
        } else {
          data = await apiClient.comment.reply(comment.id, model)
        }
        success()

        if (!socketClient.socket.connected) {
          commentStore.addComment(data)
        }
        setReplyId('')
      } catch (err) {
        error()
        console.error(err)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comment.id, logged],
  )
  const handleDelete = useCallback(
    (id: string) => async () => {
      await apiClient.comment.proxy(id).delete()

      message.success('删除成功~')
      commentStore.deleteComment(id)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const url = useMemo(() => {
    try {
      const host = new URL(comment.url || '').host
      return `//${host}`
    } catch {
      return undefined
    }
  }, [comment.url])

  const actionsEl = useMemo(
    () => [
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
    ],
    [comment.id, handleDelete, logged, replyId, sure],
  )
  return (
    <Comment
      // @ts-expect-error
      location={comment.location}
      key={comment.id}
      data-comment-id={comment.id}
      id={`comments-${comment.id}`}
      highlight={comment.highlight}
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
          disallowedTypes={disallowedTypes}
          renderers={useMemo(
            () => ({
              commentAt: ({ value }) => <CommentAtRender id={value} />,
            }),
            [],
          )}
        />
      }
      datetime={comment.created}
      commentKey={comment.key}
      actions={actionsEl}
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
