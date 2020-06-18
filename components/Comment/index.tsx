import { message, Pagination } from 'antd'
import { PagerModel } from 'models/base'
import { CommentModel, CommentPager } from 'models/comment'
import {
  createContext,
  FC,
  useEffect,
  useState,
  useCallback,
  Fragment,
} from 'react'
import LazyLoad from 'react-lazyload'
import { Rest } from 'utils/api'
import CommentBox from './box'
import Comment from './comment'
import styles from './index.module.scss'
import { useStore } from '../../common/store'
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
  allowComment: boolean
}
const CommentWrap: FC<CommentWrapProps> = observer((props) => {
  const { type, id, allowComment } = props
  const [comments, setComments] = useState([] as CommentModel[])
  const [page, setPage] = useState({} as PagerModel['page'])
  const { userStore } = useStore()
  const logged = userStore.isLogged
  const fetchComments = useCallback(
    (page = 1, size = 10) =>
      Rest('Comment', 'ref/' + id)
        .gets<CommentPager>({
          page,
          size,
          ts: new Date().getTime(),
        })
        .then(({ data, page }) => {
          setComments(data)
          setPage(page)
        }),
    [id],
  )
  useEffect(() => {
    fetchComments()
  }, [type, id, fetchComments])

  const handleComment = async (model) => {
    openCommentMessage()
    if (logged) {
      await Rest(
        'Comment',
        `master/comment/${id}?ref=${type}&ts=${new Date().getTime()}`,
      ).post(model)
    } else {
      await Rest(
        'Comment',
        `${id}?ref=${type}&ts=${new Date().getTime()}`,
      ).post(model)
    }
    openCommentMessage.success()
    fetchComments()
  }

  return (
    <article className={styles.wrap}>
      <CommentContext.Provider value={{ type, refresh: fetchComments }}>
        {allowComment && (
          <h1>
            {comments.length
              ? `共有${comments.length}条评论`
              : '亲亲留个评论再走呗'}
          </h1>
        )}

        {allowComment ? (
          <CommentBox onSubmit={handleComment} />
        ) : (
          <h1>主人禁止了评论</h1>
        )}
        <LazyLoad
          offset={50}
          once
          placeholder={<div style={{ minHeight: '15rem' }} />}
        >
          <Fragment>
            <Comment comments={comments} fetchComments={fetchComments} />
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
          </Fragment>
        </LazyLoad>
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
