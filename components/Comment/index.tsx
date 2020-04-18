import { FC, createContext, useState, useEffect } from 'react'
import { CommentModel, CommentPager } from 'models/dto/comment'
import styles from './index.module.scss'
import Comment from './comment'
import CommentBox from './box'
import { Rest } from 'utils/api'

export type CommentType = 'Note' | 'Post' | 'Page'

export const CommentContext = createContext({
  type: '' as CommentType,
  refresh: {} as () => any,
})
const CommentWrap: FC<{
  type: CommentType
  id: string
}> = (props) => {
  const { type, id } = props
  const [comments, setComments] = useState([] as CommentModel[])
  const fetchComments = () =>
    Rest('Comment', 'ref')
      .get<CommentPager>(id)
      .then(({ data }) => {
        setComments(data)
      })
  useEffect(() => {
    fetchComments()
  }, [])

  const handleComment = async (model) => {
    await Rest('Comment', `${id}?ref=${type}`).post(model)
    fetchComments()
  }
  return (
    <article className={styles.wrap}>
      <CommentContext.Provider value={{ type, refresh: fetchComments }}>
        <h1>共有{comments.length}条评论</h1>
        <CommentBox onSubmit={handleComment} />
        <Comment comments={comments} />
      </CommentContext.Provider>
    </article>
  )
}

export default CommentWrap
