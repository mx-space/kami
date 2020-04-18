import { FC } from 'react'
import { CommentModel } from 'models/dto/comment'
import styles from './index.module.scss'
import Comment from './comment'
const CommentWrap: FC<{ comments: CommentModel[] }> = (props) => {
  const { comments = [] } = props
  return (
    <article className={styles.wrap}>
      <h1>共有{comments.length}条评论</h1>
      <Comment />
    </article>
  )
}

export default CommentWrap
