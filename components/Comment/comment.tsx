import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Comment, message, Popconfirm } from 'antd'
import Markdown from 'components/MD-render'
import { CommentModel } from 'models/comment'
import QueueAnim from 'rc-queue-anim'
import { FC, memo, useContext, useState } from 'react'
import { Rest } from 'utils/api'
import { relativeTimeFromNow } from 'utils/time'
import { CommentContext, minHeightProperty, openCommentMessage } from '.'
import { useStore } from '../../common/store'
import { animatingClassName } from '../../layouts/NoteLayout'
import CommentBox from './box'
import styles from './index.module.scss'

function getCommentWrap<T extends { _id: string }>(comment: T) {
  const $wrap = document.getElementById('comments-wrap')
  if (!$wrap) {
    return
  }
  const $parent = $wrap.querySelector<HTMLDivElement>(
    '[data-comment-id="'.concat(comment._id, '"] #write'),
  )
  return $parent
}
const Comments: FC<{
  comments: CommentModel[]
  fetchComments: Function
}> = memo(({ comments, fetchComments }) => {
  const { refresh, collection } = useContext(CommentContext)
  const [replyId, setReplyId] = useState('')
  const { userStore } = useStore()
  const logged = userStore.isLogged

  if (comments.length === 0) {
    return null
  }

  const renderSingleComment = (
    comment: CommentModel,
    children?: JSX.Element | JSX.Element[],
  ) => {
    const handleReply = async (model) => {
      openCommentMessage()
      if (logged) {
        await Rest('Comment', 'master/reply/' + comment._id).post(model)
      } else {
        await Rest('Comment', 'reply/' + comment._id).post(model)
      }
      openCommentMessage.success()
      refresh()
      setReplyId('')
    }
    const handleDelete = (id: string) => async () => {
      await Rest('Comment').del(id)
      message.success('删除成功~')
      fetchComments()
    }
    const getUrl = () => {
      try {
        const host = new URL(comment.url).host
        return '//' + host
      } catch {
        return undefined
      }
    }
    const url = getUrl()
    return (
      <Comment
        key={comment._id}
        data-comment-id={comment._id}
        author={
          <a href={url} rel={'nofollow'}>
            {comment.author}
          </a>
        }
        avatar={
          <a href={url} rel={'nofollow'} target={'_blank'}>
            <Avatar
              icon={<FontAwesomeIcon icon={faUser} />}
              src={comment.avatar}
              alt={comment.author}
            />
          </a>
        }
        content={
          <Markdown
            value={`${
              comment.parent
                ? `@${collection.get(comment.parent)?._id || ''} `
                : ''
            }${comment.text}`}
            className={styles['comment']}
            renderers={{
              commentAt: ({ value }) => {
                const comment = collection.get(value)
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
                      console.log($parent)
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
        datetime={relativeTimeFromNow(comment.created) + ' ' + comment.key}
        actions={[
          <span
            key="comment-list-reply-to-0"
            onClick={() => setReplyId(comment._id)}
          >
            回复
          </span>,
          logged ? (
            <Popconfirm
              title="真的要删除这条评论?"
              onConfirm={handleDelete(comment._id)}
              okText="嗯!"
              cancelText="手抖了"
            >
              <span key="comment-list-delete">删除</span>
            </Popconfirm>
          ) : null,
        ]}
      >
        {replyId === comment._id && (
          <CommentBox onSubmit={handleReply} onCancel={() => setReplyId('')} />
        )}
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
})
export default Comments
