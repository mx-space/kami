/*
 * @Author: Innei
 * @Date: 2020-07-01 19:25:29
 * @LastEditTime: 2020-09-13 17:47:16
 * @LastEditors: Innei
 * @FilePath: /mx-web/components/Comment/index.tsx
 * @Coding with Love
 */

import { message } from 'utils/message'
import { PagerModel } from 'models/base'
import { CommentModel, CommentPager } from 'models/comment'
import {
  createContext,
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { Rest } from 'utils/api'
import { observer } from 'utils/mobx'
import { useStore } from '../../common/store'
import { flattenChildren } from '../../utils'
import { Pagination } from '../Pagination'
import CommentBox from './box'
import Comment from './comment'
import styles from './index.module.scss'
import { CommentLoading } from './loding'

export type CommentType = 'Note' | 'Post' | 'Page'

export const CommentContext = createContext({
  type: '' as CommentType,
  refresh: {} as () => any,
  collection: new Map<string, Omit<CommentModel, 'children'>>(),
})

export const openCommentMessage = () => {
  message.loading({ content: '发送中', duration: 500 })
}

openCommentMessage.success = () => {
  message.success({ content: '成功啦', duration: 2000 })
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
  const collection = useMemo(
    () => new Map<string, Omit<CommentModel, 'children'>>(),
    [],
  )

  const fetchComments = useCallback(
    (page = 1, size = 10) => {
      Rest('Comment', 'ref/' + id)
        .gets<CommentPager>({
          page,
          size,
          ts: new Date().getTime(),
        })
        .then(({ data, page }) => {
          collection.clear()
          flattenChildren(data).forEach((i) => {
            collection.set(i._id, i)
          })

          setComments(data)
          setPage(page)
          setCommentShow(true)
        })
    },
    [collection, id],
  )

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
    new Promise(() => {
      openCommentMessage.success()
      fetchComments()
    })
  }

  const [commentShow, setCommentShow] = useState(false)

  const [ref, inView, entry] = useInView({
    /* Optional options */
    threshold: 0.5,
  })
  useEffect(() => {
    if (inView && !commentShow) {
      fetchComments()
    }
  }, [inView])

  useEffect(() => {
    setComments([])
    setCommentShow(false)
  }, [id])
  return (
    <article className={styles.wrap} ref={ref}>
      <CommentContext.Provider
        value={{ type, refresh: fetchComments, collection }}
      >
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
        <span id="comment-anchor"></span>
        {commentShow ? (
          <Fragment>
            <Comment comments={comments} onFetch={fetchComments} id={id} />
            <div style={{ textAlign: 'center' }}>
              {page && page.totalPage !== 0 && page.total !== undefined && (
                <Pagination
                  hideOnSinglePage
                  current={page.currentPage || 1}
                  onChange={(page) => {
                    document.getElementById('comment-anchor')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                    requestAnimationFrame(() => {
                      fetchComments(page)
                    })
                  }}
                  total={page.totalPage}
                />
              )}
            </div>
          </Fragment>
        ) : (
          <CommentLoading />
        )}
      </CommentContext.Provider>
    </article>
  )
})

// export const CommentLazy: FC<CommentWrapProps> = (props) => {
//   return (
//     // <LazyLoad
//     //   offset={-50}
//     //   once
//     //   debounce
//     //   throttle
//     //   placeholder={<div style={minHeightProperty} />}
//     // >
//     <CommentWrap {...props} />
//     // </LazyLoad>
//   )
// }
export const CommentLazy = CommentWrap
export const minHeightProperty = { minHeight: '400px' }

export default CommentWrap
