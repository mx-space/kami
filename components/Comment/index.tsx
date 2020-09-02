/*
 * @Author: Innei
 * @Date: 2020-07-01 19:25:29
 * @LastEditTime: 2020-09-02 13:55:15
 * @LastEditors: Innei
 * @FilePath: /mx-web/components/Comment/index.tsx
 * @Coding with Love
 */

import { message } from 'antd'
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
import LazyLoad from 'react-lazyload'
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

const commentsCache = {
  id: null! as string,
  data: [] as any[],
  page: {} as PagerModel['page'],
  timestamp: new Date(),
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
  useEffect(() => {
    commentsCache.id = null!
  }, [id])
  const fetchComments = useCallback(
    (page = commentsCache.page.currentPage || 1, size = 10, force = false) => {
      if (
        force ||
        id !== commentsCache.id ||
        page !== commentsCache.page.currentPage ||
        Math.abs(commentsCache.timestamp.getTime() - new Date().getTime()) >
          3600000
      ) {
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

            {
              commentsCache.data = data
              commentsCache.page = page
              commentsCache.id = id
              commentsCache.timestamp = new Date()
            }
          })
      } else {
        setComments(commentsCache.data)
        setPage(commentsCache.page)
      }
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

  return (
    <article className={styles.wrap}>
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
        <LazyLoad
          offset={50}
          debounce
          throttle
          key={id}
          unmountIfInvisible
          placeholder={<CommentLoading />}
        >
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
        </LazyLoad>
      </CommentContext.Provider>
    </article>
  )
})

export const CommentLazy: FC<CommentWrapProps> = (props) => {
  return (
    // <LazyLoad
    //   offset={-50}
    //   once
    //   debounce
    //   throttle
    //   placeholder={<div style={minHeightProperty} />}
    // >
    <CommentWrap {...props} />
    // </LazyLoad>
  )
}

export const minHeightProperty = { minHeight: '400px' }

export default CommentWrap
