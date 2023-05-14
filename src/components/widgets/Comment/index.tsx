import { clsx } from 'clsx'
import type { FC } from 'react'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { message } from 'react-message-popup'
import { useHash } from 'react-use'

import type { Pager } from '@mx-space/api-client'

import { useCommentCollection } from '~/atoms/collections/comment'
import { useIsLogged } from '~/atoms/user'
import { withNoSSR } from '~/components/app/HoC/no-ssr'
import { useKamiConfig } from '~/hooks/app/use-initial-data'
import { useIsClient } from '~/hooks/common/use-is-client'
import { apiClient } from '~/utils/client'
import { springScrollToElement } from '~/utils/spring'

import { Pagination } from '../../ui/Pagination'
import { CommentBox } from './box'
import { Comments } from './comments'
import styles from './index.module.css'
import { CommentLoading } from './loading'

export const openCommentMessage = async () => {
  const { next } = await message.loading({
    content: '发送中',
    duration: 3000,
  })

  return {
    success: () => {
      next('成功啦', 'success')
    },
    error: () => {
      next('失败了，www', 'error')
    },
  }
}

interface CommentWrapProps {
  id: string
  allowComment: boolean
  warpperClassName?: string
}

const CommentWrap: FC<CommentWrapProps> = (props) => {
  const { id, allowComment } = props

  const [pagination, setPagination] = useState({} as Pager)
  const logged = useIsLogged()
  const comments = useCommentCollection((state) => state.comments)

  useEffect(() => {
    return () => {
      useCommentCollection.getState().reset()
    }
  }, [])

  const fetchComments = useCallback(
    async (page = 1, size = 10) => {
      return useCommentCollection
        .getState()
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

          $el && springScrollToElement($el, -250)
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
    <div
      className={clsx(styles.wrap, props.warpperClassName)}
      ref={ref}
      data-hide-print
      id="comments"
    >
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
          <Comments allowComment={allowComment} />
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
}

const Comment: typeof CommentWrap = (props) => {
  const {
    function: {
      comment: { disable },
    },
  } = useKamiConfig()

  if (disable) {
    return (
      <h1 className="headline dark:text-shizuku-text !mt-6 text-lg font-semibold">
        全站评论功能未开放
      </h1>
    )
  }
  return <CommentWrap {...props} />
}
export const CommentLazy = withNoSSR(Comment)
