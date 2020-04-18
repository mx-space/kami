import { Avatar, Comment, List } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import Markdown from 'components/MD-render'
import { CommentModel } from 'models/dto/comment'
import { FC, useState, useContext, useEffect } from 'react'
import CommentBox from './box'
import { relativeTimeFromNow } from 'utils/time'
import { Rest } from 'utils/api'
import { CommentContext } from '.'

const Comments: FC<{ comments: CommentModel[] }> = ({ comments }) => {
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
      await Rest('Comment', 'reply/' + comment._id).post(model)
      refresh()
    }

    return (
      <Comment
        key={comment._id}
        author={
          <a href={'//' + (comment.url?.replace(/^https?/, '') ?? '')}>
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
        {replyId === comment._id && <CommentBox onSubmit={handleReply} />}
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
    <>
      {comments.map((comment) => {
        return renderComments(comment)
      })}
    </>
  )
}
export default Comments
