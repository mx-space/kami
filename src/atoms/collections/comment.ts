import { immerable } from 'immer'

import type { CommentModel } from '@mx-space/api-client'

import { apiClient } from '~/utils/client'

import { createCollection } from './utils/base'

interface CommentCollection {
  currentRefId: string
  comments: CommentModelWithHighlight[]
  setHighlightCommnet(id: string, highlight?: boolean): void
  fetchComment(
    refId: string,
    page?: number,
    size?: number,
  ): Promise<Awaited<ReturnType<typeof apiClient.comment.getByRefId>>>
  currentFetchPage: number | undefined
  updateComment(comment: CommentModelWithHighlight): void
  addComment(comment: CommentModel): void
  unPinComment(id: string): void
  pinComment(id: string): void
  deleteComment(id: string): void
  reset(): void
}

const createState = () => {
  const data = new Map<string, CommentModelWithHighlight>()
  data[immerable] = true

  const commentInitialState = {
    data,
    currentRefId: '',
    comments: [] as CommentModelWithHighlight[],
    currentFetchPage: 1,
  }
  return commentInitialState
}
export type CommentModelWithHighlight = CommentModel & {
  children: CommentModelWithHighlight[]
  parent?: string | { id?: string }
  highlight?: boolean
  isDeleted?: boolean
}

type CommentModelWithReplies = CommentModel & {
  children?: CommentModel[]
  replies?: CommentModel[]
}
export const useCommentCollection = createCollection<
  CommentModelWithHighlight,
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
        state.comments = data.data.map((item) => normalizeThreadComment(item))

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
      const normalizedComment = normalizeThreadComment(comment)

      const refId =
        typeof normalizedComment.ref === 'string'
          ? normalizedComment.ref
          : (normalizedComment.ref as any).id

      if (refId !== getState().currentRefId) {
        return
      }

      const state = getState()
      const parentRaw = (normalizedComment as any).parent
      const parentId =
        typeof parentRaw === 'string' ? parentRaw : parentRaw?.id

      const isSubComment = !!parentId && state.data.has(parentId)
      if (isSubComment) {
        setState((state) => {
          state.data.set(normalizedComment.id, normalizedComment)
          const parentComment = state.data.get(parentId!)

          state.data = new Map(state.data)

          if (parentComment) {
            parentComment.children.push(normalizedComment)

            state.updateComment(parentComment)
          }
        })
      } else {
        setState((state) => {
          const hasPinComment = state.comments.findIndex(
            (comment) => comment.pin,
          )
          let nextComments: CommentModelWithHighlight[] = state.comments.concat()
          if (-~hasPinComment) {
            nextComments = [
              nextComments[0],
              normalizedComment,
              ...nextComments.slice(1),
            ]
          } else {
            nextComments = [normalizedComment, ...nextComments]
          }

          state.comments = nextComments
          state.data.set(normalizedComment.id, normalizedComment)
          walkComments(normalizedComment.children).forEach((child) => {
            state.data.set(child.id, child)
          })
        })
      }

      return normalizedComment
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

function normalizeThreadComment(item: CommentModel): CommentModelWithHighlight {
  const threadChildren = getThreadChildren(item)
  return {
    ...item,
    children: threadChildren.map((reply) => normalizeThreadComment(reply)),
  }
}

function getThreadChildren(item: CommentModel): CommentModel[] {
  const comment = item as CommentModelWithReplies
  return comment.children ?? comment.replies ?? []
}

function walkComments(comments: CommentModelWithHighlight[]): CommentModelWithHighlight[] {
  const allComments = [] as CommentModelWithHighlight[]

  const walkChild = (comment: CommentModelWithHighlight): CommentModelWithHighlight[] => {
    const allComments = [] as CommentModelWithHighlight[]
    if (!comment.id) return []
    if (comment.children?.length) {
      // @ts-ignore
      return comment.children.reduce((arr: CommentModelWithHighlight[], child) => {
        if (!child.id) return arr
        return [...arr, child, ...walkChild(child)]
      }, allComments) as CommentModelWithHighlight[]
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
