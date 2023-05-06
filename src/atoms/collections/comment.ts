import { immerable } from 'immer'

import type { CommentModel, PaginateResult } from '@mx-space/api-client'

import { apiClient } from '~/utils/client'

import { createCollection } from './utils/base'

interface CommentCollection {
  currentRefId: string
  comments: CommentModel[]
  setHighlightCommnet(id: string, highlight?: boolean): void
  fetchComment(
    refId: string,
    page?: number,
    size?: number,
  ): Promise<PaginateResult<CommentModel>>
  currentFetchPage: number | undefined
  updateComment(comment: CommentModel): void
  addComment(comment: CommentModel): void
  unPinComment(id: string): void
  pinComment(id: string): void
  deleteComment(id: string): void
  reset(): void
}

const createState = () => {
  const data = new Map<string, CommentModel>()
  data[immerable] = true

  const commentInitialState = {
    data,
    currentRefId: '',
    comments: [],
    currentFetchPage: 1,
  }
  return commentInitialState
}
export type CommentModelWithHighlight = CommentModel & {
  highlight?: boolean
  isDeleted?: boolean
}
export const useCommentCollection = createCollection<
  CommentModel & { highlight?: boolean },
  CommentCollection
>('comment', (setState, getState) => {
  return {
    ...createState(),
    setHighlightCommnet(id: string, highlight = true) {
      setState((state) => {
        const comment = state.data.get(id)
        if (!comment) {
          return
        }
        comment.highlight = highlight
      })
    },
    async fetchComment(refId, page, size) {
      const state = getState()
      page ??= state.currentFetchPage
      size ??= 10

      const data = await apiClient.comment.getByRefId(refId, {
        page,
        size,
      })

      setState((state) => {
        state.currentRefId = refId
        state.currentFetchPage = page
        state.data.clear()
        state.comments = [...data.data]

        const flatAllComments = walkComments(state.comments)

        flatAllComments.forEach((comment) => {
          state.data.set(comment.id, comment)
        })
      })

      return data
    },
    updateComment(comment) {
      const state = getState()
      const oldComment = state.data.get(comment.id)
      if (!oldComment) {
        return
      }

      if (oldComment.ref !== comment.ref) {
        return
      }

      setState((state) => {
        walkComments(comment.children).forEach((comment) => {
          state.data.set(comment.id, comment)
        })
      })

      return Object.assign({}, oldComment, comment)
    },

    addComment(comment) {
      if (!comment) return

      const refId =
        typeof comment.ref === 'string' ? comment.ref : (comment.ref as any).id

      if (refId !== getState().currentRefId) {
        return
      }

      const state = getState()

      const isSubComment =
        comment.parent &&
        ((typeof comment.parent === 'string' &&
          state.data.has(comment.parent)) ||
          state.data.has((comment.parent as CommentModel)?.id))
      if (isSubComment) {
        setState((state) => {
          state.data.set(comment.id, comment)
          const parentComment = state.data.get(
            typeof comment.parent === 'string'
              ? comment.parent
              : comment.parent?.id || '',
          )

          state.data = new Map(state.data)

          if (parentComment) {
            parentComment.children.push(comment)

            state.updateComment(parentComment)
          }
        })
      } else {
        setState((state) => {
          const hasPinComment = state.comments.findIndex(
            (comment) => comment.pin,
          )
          let nextComments: CommentModel[] = state.comments.concat()
          if (-~hasPinComment) {
            nextComments = [nextComments[0], comment, ...nextComments.slice(1)]
          } else {
            nextComments = [comment, ...nextComments]
          }

          state.comments = nextComments
          state.data.set(comment.id, comment)
          walkComments(comment.children).forEach((child) => {
            state.data.set(child.id, child)
          })
        })
      }

      return comment
    },

    unPinComment(id) {
      setState((state) => {
        const comment = state.data.get(id)
        if (!comment) {
          return
        }
        comment.pin = false

        requestAnimationFrame(() => {
          const state = getState()
          state.fetchComment(state.currentRefId)
        })
      })
    },

    pinComment(id) {
      setState((state: ReturnType<typeof getState>) => {
        const comment = state.data.get(id)

        if (!comment) {
          return
        }
        const commentPinStatus = comment.pin

        for (const currentComment of state.comments) {
          currentComment.pin = false
        }
        comment.pin = !commentPinStatus

        const pinCommentIndex = state.comments.findIndex(
          (comment) => comment.pin,
        )
        if (-~pinCommentIndex) {
          const pinComment = state.comments.splice(pinCommentIndex, 1)[0]
          state.comments = [pinComment, ...state.comments]
        }
      })
    },
    deleteComment(id) {
      setState((state: ReturnType<typeof getState>) => {
        const comment = state.data.get(id)
        if (!comment) {
          return
        }

        state.data.delete(id)
      })
    },
    reset() {
      setState(createState())
    },
  }
})

function walkComments(comments: CommentModel[]): CommentModel[] {
  const allComments = [] as CommentModel[]

  const walkChild = (comment: CommentModel): CommentModel[] => {
    const allComments = [] as CommentModel[]
    if (!comment.id) return []
    if (comment.children.length) {
      // @ts-ignore
      return comment.children.reduce((arr: CommentModel[], child) => {
        if (!child.id) return arr
        return [...arr, child, ...walkChild(child)]
      }, allComments) as CommentModel[]
    }

    return allComments
  }

  return comments.reduce((acc, comment) => {
    const nextResult = acc.concat()
    // 脏数据
    if (!comment.id) {
      return nextResult
    }
    return nextResult.concat(comment, ...walkChild(comment))
  }, allComments)
}
