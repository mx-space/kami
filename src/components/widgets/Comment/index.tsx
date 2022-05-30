import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { message } from 'react-message-popup'

import type { CommentModel, Pager } from '@mx-space/api-client'

import { apiClient } from '~/utils/client'

import { useStore } from '../../../store'
import { NoSSR, flattenChildren } from '../../../utils'
import { Pagination } from '../../universal/Pagination'
import { CommentBox } from './box'
import { Comments } from './comments'
import styles from './index.module.css'
import { CommentLoading } from './loading'

export const openCommentMessage = async () => {
  const { destory } = await message.loading({
    content: '发送中',
    duration: 20000,
  })

  return {
    success: () => {
      destory()
      message.success({ content: '成功啦', duration: 2000 })
    },
    error: () => {
      destory()
      message.error({ content: '失败了, 555', duration: 2000 })
    },
  }
}

interface CommentWrapProps {
  id: string
  allowComment: boolean
}

const _CommentWrap: FC<CommentWrapProps> = observer((props) => {
  const { id, allowComment } = props
  const [comments, setComments] = useState([] as CommentModel[])
  const [pagination, setPagination] = useState({} as Pager)
  const { userStore } = useStore()
  const logged = userStore.isLogged
  const collection = useMemo(
    () => new Map<string, Omit<CommentModel, 'children'>>(),
    [],
  )

  const { commentStore } = useStore()

  useEffect(() => {
    return () => {
      commentStore.reset()
    }
  }, [])

  const fetchComments = useCallback(
    (page = 1, size = 10) => {
      commentStore.fetchComment(id, page, size).then(({ data, pagination }) => {
        collection.clear()

        flattenChildren(data as CommentModel[]).forEach((i) => {
          collection.set(i.id, i)
        })

        setComments(data)
        setPagination(pagination)
        setCommentShow(true)
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collection, id],
  )

  const handleComment = useCallback(
    async (model) => {
      const { success, error } = await openCommentMessage()
      try {
        if (logged) {
          await apiClient.comment.proxy.master.comment(id).post({
            params: {
              ts: Date.now(),
            },
            data: { ...model },
          })
        } else {
          await apiClient.comment.comment(id, model)
        }
        requestAnimationFrame(() => {
          success()
          fetchComments()
        })
      } catch (e) {
        error()

        console.error(e)
      }
    },
    [fetchComments, id, logged],
  )

  const [commentShow, setCommentShow] = useState(false)

  const { ref } = useInView({
    threshold: 0.5,
    onChange(inView) {
      if (inView && !commentShow) {
        fetchComments()
      }
    },
  })

  useEffect(() => {
    setComments([])
    setCommentShow(false)
  }, [id])

  return (
    <div className={styles.wrap} ref={ref} data-hide-print id="comments">
      {allowComment && (
        <h1 className="headline">
          {comments.length
            ? `共有${comments.length}条评论`
            : '亲亲留个评论再走呗'}
        </h1>
      )}

      {allowComment ? (
        <CommentBox onSubmit={handleComment} />
      ) : (
        <h1 className="headline">主人禁止了评论</h1>
      )}
      <span id="comment-anchor"></span>
      {commentShow ? (
        <Fragment>
          <Comments />
          <div className="text-center">
            {pagination &&
              pagination.totalPage !== 0 &&
              pagination.total !== undefined && (
                <Pagination
                  current={pagination.currentPage || 1}
                  onChange={(page) => {
                    document.getElementById('comment-anchor')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                    requestAnimationFrame(() => {
                      fetchComments(page)
                    })
                  }}
                  total={pagination.totalPage}
                />
              )}
          </div>
        </Fragment>
      ) : (
        <CommentLoading />
      )}
    </div>
  )
})

const CommentWrap = NoSSR(_CommentWrap)
export { CommentWrap as CommentLazy }
export const minHeightProperty = { minHeight: '400px' }
