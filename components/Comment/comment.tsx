import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Comment, message, Popconfirm } from 'antd'
import Markdown from 'components/MD-render'
import { CommentModel } from 'models/comment'
import { FC, useContext, useState, memo } from 'react'
import { Rest } from 'utils/api'
import { relativeTimeFromNow } from 'utils/time'
import { CommentContext, openCommentMessage } from '.'
import CommentBox from './box'
import QueueAnim from 'rc-queue-anim'
import { useStore } from '../../common/store'

const Comments: FC<{
  comments: CommentModel[]
  fetchComments: Function
}> = memo(({ comments, fetchComments }) => {
  const { refresh } = useContext(CommentContext)
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
        return 'javascript:;'
      }
    }
    const url = getUrl()
    return (
      <Comment
        key={comment._id}
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
        content={<Markdown value={comment.text} />}
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
    <QueueAnim type={['right', 'left']} leaveReverse>
      {comments.map((comment) => {
        return renderComments(comment)
      })}
    </QueueAnim>
  )
})
export default Comments
