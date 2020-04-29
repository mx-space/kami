import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Comment } from 'antd'
import Markdown from 'components/MD-render'
import { CommentModel } from 'models/dto/comment'
import { FC, useContext, useState } from 'react'
import { Rest } from 'utils/api'
import { relativeTimeFromNow } from 'utils/time'
import { CommentContext, openCommentMessage } from '.'
import CommentBox from './box'
import QueueAnim from 'rc-queue-anim'

const Comments: FC<{ comments: CommentModel[]; inView: boolean }> = ({
  comments,
  inView,
}) => {
  const { refresh } = useContext(CommentContext)
  const [replyId, setReplyId] = useState('')

  if (comments.length === 0) {
    return null
  }

  const renderSingleComment = (
    comment: CommentModel,
    children?: JSX.Element | JSX.Element[],
  ) => {
    const handleReply = async (model) => {
      openCommentMessage()
      await Rest('Comment', 'reply/' + comment._id).post(model)
      openCommentMessage.success()
      refresh()
      setReplyId('')
    }

    return (
      <Comment
        key={comment._id}
        author={
          <a
            href={'//' + (comment.url?.replace(/^https?/, '') ?? '')}
            rel={'nofollow'}
          >
            {comment.author}
          </a>
        }
        avatar={
          <Avatar
            icon={<FontAwesomeIcon icon={faUser} />}
            src={comment.avatar}
            alt={comment.author}
          />
        }
        content={<Markdown value={comment.text} />}
        datetime={relativeTimeFromNow(comment.created)}
        actions={[
          <span
            key="comment-list-reply-to-0"
            onClick={() => setReplyId(comment._id)}
          >
            回复
          </span>,
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
      const childComments = children.map((comment: CommentModel) => {
        return renderComments(comment)
      })

      return renderSingleComment(comment, childComments)
    }
    return renderSingleComment(comment)
  }

  return (
    <QueueAnim type={['right', 'left']} leaveReverse>
      {inView
        ? comments.map((comment) => {
            return renderComments(comment)
          })
        : null}
    </QueueAnim>
  )
}
export default Comments
