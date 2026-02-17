import { clsx } from 'clsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { sanitizeUrl } from 'markdown-to-jsx'
import type { FC } from 'react'
import {
  Fragment,
  createElement,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslations } from 'next-intl'
import { message } from 'react-message-popup'
import { shallow } from 'zustand/shallow'

import type { CommentModel } from '@mx-space/api-client'

import type { CommentModelWithHighlight } from '~/atoms/collections/comment'
import { useCommentCollection } from '~/atoms/collections/comment'
import { useUserStore } from '~/atoms/user'
import { IconTransition } from '~/components/common/IconTransition'
import { ImpressionView } from '~/components/common/ImpressionView'
import { KamiMarkdown } from '~/components/common/KamiMarkdown'
import { PhPushPin, PhPushPinFill } from '~/components/ui/Icons/for-post'
import { ImageTagPreview } from '~/components/ui/ImageTagPreview'
import { BottomToUpTransitionView } from '~/components/ui/Transition/BottomToUpTransitionView'
import { socketClient } from '~/socket'
import { apiClient } from '~/utils/client'

import { openCommentMessage } from '.'
import { Avatar } from './avatar'
import { CommentBox } from './box'
import { Comment } from './comment'
import { Empty } from './empty'
import styles from './index.module.css'
import { CommentAtRender } from './renderers/comment-at'

type Id = string
export const Comments: FC<{ allowComment: boolean }> = memo(
  ({ allowComment }) => {
    const comments = useCommentCollection((state) => state.comments)

    if (comments.length === 0) {
      return allowComment ? <Empty /> : null
    }

    return createElement(CommentList)
  },
)

const CommentList: FC = memo(() => {
  const comments = useCommentCollection((state) => state.comments)

  return (
    <BottomToUpTransitionView
      appear
      timeout={useRef({ appear: 300, enter: 500 }).current}
    >
      <div id="comments-wrap">
        {comments.map((comment) => {
          return <InnerCommentList id={comment.id} key={comment.id} />
        })}
      </div>
    </BottomToUpTransitionView>
  )
})

const SingleComment: FC<{ id: string }> = ({ id, children }) => {
  const t = useTranslations('comment')
  const tCommon = useTranslations('common')
  const [replyId, setReplyId] = useState('')

  const {
    avatar: masterAvatar,
    name: masterName,
    logged,
  } = useUserStore<{
    avatar: string
    name: string
    logged: boolean
  }>(
    (state) => ({
      avatar: state.master?.avatar || '',
      name: state.master?.name || '',
      logged: state.isLogged,
    }),
    shallow,
  )

  const { commentIdMap, comments } = useCommentCollection<{
    commentIdMap: Map<Id, CommentModel>
    comments: CommentModel[]
  }>(
    (state) => ({
      commentIdMap: state.data,
      comments: state.comments,
    }),
    shallow,
  )

  const commentCollection = useCommentCollection.getState()

  const comment: CommentModelWithHighlight = commentIdMap.get(id)!

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
          commentCollection.addComment(data)
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

      message.success(t('deleteSuccess'))
      commentCollection.deleteComment(id)
    },
    [t],
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
        {replyId !== comment.id ? t('reply') : t('cancelReply')}
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
              {t('delete')}
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
              {t('confirmDelete')}
            </span>
          )}
        </Fragment>
      ) : null,
    ],
    [comment.id, handleDelete, logged, replyId, sure, t],
  )
  const handlePinComment = useCallback(async () => {
    const nextPinStatus = !comment.pin
    await apiClient.comment.proxy(comment.id).patch({
      data: {
        pin: nextPinStatus,
      },
    })

    if (nextPinStatus) {
      commentCollection.pinComment(comment.id)
    } else {
      commentCollection.unPinComment(comment.id)
    }
  }, [comment, comments])

  return (
    <Comment
      whispers={comment.isWhispers}
      // @ts-ignore
      location={comment.location}
      key={comment.id}
      data-comment-id={comment.id}
      id={`comments-${comment.id}`}
      highlight={comment.highlight}
      author={
        <a href={url} rel="nofollow" target="_blank">
          {comment.author}
        </a>
      }
      avatar={
        <Avatar
          src={comment.author === masterName ? masterAvatar! : comment.avatar}
        />
      }
      content={
        <KamiMarkdown
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
          key="box"
          onSubmit={handleReply}
          onCancel={() => setReplyId('')}
        />
      )}

      {logged && !comment.parent && (
        <div
          className={clsx(
            'absolute right-3 top-5 opacity-30 transition-opacity duration-300 hover:opacity-100',

            comment.pin && 'text-red !opacity-100',
          )}
          role="button"
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
        <ImpressionView trackerMessage={tCommon('trackPinnedComment')}>
          <div className="text-red absolute right-3 top-5">
            <PhPushPin />
          </div>
        </ImpressionView>
      )}

      {children}
    </Comment>
  )
}
const InnerCommentList = memo<{ id: string }>(({ id }) => {
  const comment = useCommentCollection((state) => state.data.get(id))

  if (!comment) {
    return null
  }
  if (comment.children?.length > 0) {
    const children = comment.children

    const childComments = children.map((child: CommentModel) => {
      return <InnerCommentList id={child.id} key={child.id} />
    })

    return <SingleComment id={comment.id}>{childComments}</SingleComment>
  }
  return <SingleComment id={comment.id} />
})
