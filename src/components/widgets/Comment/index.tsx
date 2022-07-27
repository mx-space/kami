import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { message } from 'react-message-popup'
import { useHash } from 'react-use'

import type { Pager } from '@mx-space/api-client'

import { useIsClient } from '~/hooks/use-is-client'
import { apiClient } from '~/utils/client'
import { NoSSRWrapper } from '~/utils/no-ssr'
import { springScrollToElement } from '~/utils/spring'

import { useStore } from '../../../store'
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
      message.error({ content: '失败了, www', duration: 2000 })
    },
  }
}

interface CommentWrapProps {
  id: string
  allowComment: boolean
}

const _CommentWrap: FC<CommentWrapProps> = observer((props) => {
  const { id, allowComment } = props

  const [pagination, setPagination] = useState({} as Pager)
  const { userStore, commentStore } = useStore()
  const logged = userStore.isLogged

  const comments = commentStore.comments

  useEffect(() => {
    return () => {
      commentStore.reset()
    }
  }, [])

  const fetchComments = useCallback(
    async (page = 1, size = 10) => {
      return commentStore
        .fetchComment(id, page, size)
        .then(({ data, pagination }) => {
          setPagination(pagination)
          setCommentShow(true)

          return data
        })
    },

    [id],
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

  const hash = useHash()
  const isClientSide = useIsClient()

  const shouldPreloadComment = isClientSide && hash.includes('#comments-')

  const [commentShow, setCommentShow] = useState(shouldPreloadComment)

  useEffect(() => {
    if (shouldPreloadComment) {
      setCommentShow(true)
      fetchComments().then(() => {
        setTimeout(() => {
          const $el = document.getElementById(location.hash.slice(1))

          $el && springScrollToElement($el, 1000, -250)
        }, 1000)
      })
    }
  }, [fetchComments, shouldPreloadComment])

  const { ref } = useInView({
    threshold: 0.5,
    triggerOnce: true,
    onChange(inView) {
      if (inView && !commentShow) {
        fetchComments()
      }
    },
  })

  useEffect(() => {
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
        <CommentBox onSubmit={handleComment} refId={id} />
      ) : (
        <h1 className="headline">主人禁止了评论</h1>
      )}
      <span id="comment-anchor" />
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
                    fetchComments(page)
                    requestAnimationFrame(() => {
                      springScrollToElement(
                        document.getElementById('comment-anchor')!,
                        1000,
                        -100,
                      )
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

export const CommentLazy = NoSSRWrapper(_CommentWrap)
