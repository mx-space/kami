import { clsx } from 'clsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { sanitizeUrl } from 'markdown-to-jsx'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import {
  Fragment,
  createElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { message } from 'react-message-popup'
import { socketClient } from 'socket'

import type { CommentModel } from '@mx-space/api-client'

import { ImpressionView } from '~/components/biz/ImpressionView'
import { IconTransition } from '~/components/universal/IconTransition'
import { PhPushPin, PhPushPinFill } from '~/components/universal/Icons/for-post'
import { ImageTagPreview } from '~/components/universal/ImageTagPreview'
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
      timeout={useMemo(() => ({ appear: 300, enter: 500 }), [])}
    >
      <div id={'comments-wrap'}>
        {comments
          .slice()
          .sort((comment) => (comment.pin ? -1 : 1))
          .map((comment) => {
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
  const { commentIdMap, comments } = commentStore

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
  const handlePinComment = useCallback(async () => {
    await apiClient.comment.proxy(comment.id).patch({
      data: {
        pin: !comment.pin,
      },
    })

    runInAction(() => {
      const commentPinStatus = comment.pin
      for (const currentComment of comments) {
        currentComment.pin = false
      }
      comment.pin = !commentPinStatus
    })
  }, [comment, comments])
  return (
    <Comment
      whispers={comment.isWhispers}
      // @ts-expect-error
      location={comment.location}
      key={comment.id}
      data-comment-id={comment.id}
      id={`comments-${comment.id}`}
      highlight={comment.highlight}
      author={
        <a href={url} rel={'nofollow'} target="_blank">
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
          forceBlock
          className={styles['comment']}
          disableParsingRawHTML
          disabledTypes={
            useRef<MarkdownToJSX.RuleName[]>([
              'heading',
              'blockQuote',
              'footnote',
              'table',
              'tableSeparator',
              'gfmTask',
              'headingSetext',
              'footnoteReference',
              'htmlSelfClosing',
            ]).current
          }
          renderers={useMemo(
            () => ({
              commentAt: {
                react(node, _, state) {
                  const { content } = node
                  const id = content[0]?.content
                  if (!id) {
                    return <></>
                  }

                  return <CommentAtRender id={id} key={state?.key} />
                },
              },
              image: {
                react(node, _, state) {
                  const { alt, target } = node

                  return (
                    <ImageTagPreview
                      alt={alt}
                      src={sanitizeUrl(target)!}
                      key={state?.key}
                    />
                  )
                },
              },
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
          commentId={comment.id}
          refId={comment.ref}
          autoFocus
          key={'box'}
          onSubmit={handleReply}
          onCancel={() => setReplyId('')}
        />
      )}

      {logged && !comment.parent && (
        <div
          className={clsx(
            'absolute right-3 top-5 hover:opacity-100 opacity-30 transition-opacity duration-300',

            comment.pin && 'text-red !opacity-100',
          )}
          role={'button'}
          onClick={handlePinComment}
        >
          <IconTransition
            currentState={comment.pin ? 'solid' : 'regular'}
            regularIcon={<PhPushPin />}
            solidIcon={<PhPushPinFill />}
          />
        </div>
      )}

      {!logged && comment.pin && (
        <ImpressionView trackerMessage={`置顶评论曝光`}>
          <div className="absolute right-3 top-5 text-red">
            <PhPushPin />
          </div>
        </ImpressionView>
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
