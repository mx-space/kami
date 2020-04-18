import { FC, createContext, useState, useEffect } from 'react'
import { CommentModel, CommentPager } from 'models/dto/comment'
import styles from './index.module.scss'
import Comment from './comment'
import CommentBox from './box'
import { Rest } from 'utils/api'
import { Pagination, message } from 'antd'
import { PagerModel } from 'models/dto/base'

export type CommentType = 'Note' | 'Post' | 'Page'

export const CommentContext = createContext({
  type: '' as CommentType,
  refresh: {} as () => any,
})

const key = 'updatable'

export const openCommentMessage = () => {
  message.loading({ content: '发送中', key })
}

openCommentMessage.success = () => {
  message.success({ content: '成功啦', key, duration: 2 })
}

const CommentWrap: FC<{
  type: CommentType
  id: string
}> = (props) => {
  const { type, id } = props
  const [comments, setComments] = useState([] as CommentModel[])
  const [page, setPage] = useState({} as PagerModel['page'])
  const fetchComments = (page = 1, size = 10) =>
    Rest('Comment', 'ref/' + id)
      .gets<CommentPager>({
        page,
        size,
      })
      .then(({ data, page }) => {
        setComments(data)
        setPage(page)
      })
  useEffect(() => {
    fetchComments()
  }, [])

  const handleComment = async (model) => {
    openCommentMessage()
    await Rest('Comment', `${id}?ref=${type}`).post(model)
    openCommentMessage.success()
    fetchComments()
  }
  return (
    <article className={styles.wrap}>
      <CommentContext.Provider value={{ type, refresh: fetchComments }}>
        <h1>共有{comments.length}条评论</h1>
        <CommentBox onSubmit={handleComment} />
        <Comment comments={comments} />
        <div style={{ textAlign: 'center' }}>
          <Pagination
            simple
            current={page.currentPage || 1}
            onChange={(page) => {
              fetchComments(page)
            }}
            total={page.total}
          />
        </div>
      </CommentContext.Provider>
    </article>
  )
}

export default CommentWrap
