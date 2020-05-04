import { message, Pagination } from 'antd'
import { PagerModel } from 'models/dto/base'
import { CommentModel, CommentPager } from 'models/dto/comment'
import { createContext, FC, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import LazyLoad from 'react-lazyload'
import { Rest } from 'utils/api'
import CommentBox from './box'
import Comment from './comment'
import styles from './index.module.scss'
import { useStore } from '../../store'
import { observer } from 'mobx-react'
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

interface CommentWrapProps {
  type: CommentType
  id: string
}
const CommentWrap: FC<CommentWrapProps> = observer((props) => {
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
  const { appStore } = useStore()
  const [ref, inView, _] = useInView({
    threshold: 0,
    rootMargin: appStore.viewport.mobile ? undefined : '-120px',
  })

  return (
    <article className={styles.wrap} ref={ref}>
      <CommentContext.Provider value={{ type, refresh: fetchComments }}>
        <h1>共有{comments.length}条评论</h1>
        <CommentBox onSubmit={handleComment} />

        <Comment comments={comments} inView={inView} />

        <div style={{ textAlign: 'center' }}>
          {page?.totalPage !== 0 && (
            <Pagination
              simple
              hideOnSinglePage
              current={page.currentPage || 1}
              onChange={(page) => {
                fetchComments(page)
              }}
              total={page.total}
            />
          )}
        </div>
      </CommentContext.Provider>
    </article>
  )
})

export const CommentLazy: FC<CommentWrapProps> = (props) => {
  return (
    <LazyLoad once>
      <CommentWrap {...props} />
    </LazyLoad>
  )
}

export default CommentWrap
