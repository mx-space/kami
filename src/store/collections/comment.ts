import { action, computed, makeObservable, observable } from 'mobx'
import { apiClient } from 'utils/client'

import type { CommentModel } from '@mx-space/api-client'

import { Store } from '../helper/base'

export class CommentStore extends Store<
  CommentModel & { highlight?: boolean }
> {
  constructor() {
    super()
    makeObservable(this, {
      currentRefId: observable,
      comments: observable,
      commentIdMap: computed,
      fetchComment: action,
      updateComment: action,
      addComment: action,
      deleteComment: action,
      reset: action,
      pinComment: action,
      unPinComment: action,
    })
  }
  currentRefId = ''

  comments = [] as CommentModel[]

  get commentIdMap() {
    return this.data
  }

  setHighlightCommnet(id: string, highlight = true) {
    const comment = this.commentIdMap.get(id)
    if (!comment) {
      return
    }

    comment.highlight = highlight
  }

  private currentFetchPage = 1

  async fetchComment(refId: string, page = this.currentFetchPage, size = 10) {
    const data = await apiClient.comment.getByRefId(refId, {
      page,
      size,
    })

    this.currentRefId = refId
    this.currentFetchPage = page
    this.comments = [...data.data]
    this.data.clear()

    const flatAllComments = this.walkComments(this.comments)
    flatAllComments.forEach((comment) => {
      this.data.set(comment.id, comment)
    })

    return data
  }

  updateComment(comment: CommentModel) {
    const oldComment = this.commentIdMap.get(comment.id)

    if (!oldComment) {
      return
    }

    if (oldComment.ref !== comment.ref) {
      return
    }

    this.walkComments(comment.children).forEach((comment) => {
      this.commentIdMap.set(comment.id, comment)
    })

    return Object.assign(oldComment, comment)
  }

  addComment(comment: CommentModel) {
    if (!comment) {
      return
    }

    const refId =
      typeof comment.ref === 'string' ? comment.ref : (comment.ref as any).id
    if (refId !== this.currentRefId) {
      return
    }

    const isSubComment =
      comment.parent &&
      ((typeof comment.parent === 'string' && this.data.has(comment.parent)) ||
        this.data.has((comment.parent as CommentModel)?.id))

    if (isSubComment) {
      const parentComment = this.data.get(
        typeof comment.parent === 'string'
          ? comment.parent
          : comment.parent?.id || '',
      )

      if (parentComment) {
        parentComment.children.push(comment)
        this.updateComment(parentComment)
      }
    } else {
      const hasPinComment = this.comments.findIndex((comment) => comment.pin)

      if (-~hasPinComment) {
        this.comments = [this.comments[0], comment, ...this.comments.slice(1)]
      } else {
        this.comments = [comment, ...this.comments]
      }

      this.commentIdMap.set(comment.id, comment)
      this.walkComments(comment.children).forEach((child) => {
        this.commentIdMap.set(child.id, child)
      })
    }

    return comment
  }

  unPinComment(id: string) {
    const comment = this.commentIdMap.get(id)
    if (!comment) {
      return
    }
    comment.pin = false
    this.fetchComment(this.currentRefId)
  }

  pinComment(id: string) {
    const comment = this.commentIdMap.get(id)
    if (!comment) {
      return
    }
    const commentPinStatus = comment.pin

    for (const currentComment of this.comments) {
      currentComment.pin = false
    }
    comment.pin = !commentPinStatus

    const pinCommentIndex = this.comments.findIndex((comment) => comment.pin)
    if (-~pinCommentIndex) {
      const pinComment = this.comments.splice(pinCommentIndex, 1)[0]
      this.comments = [pinComment, ...this.comments]
    }
  }

  deleteComment(id: string) {
    const hasComment = this.data.has(id)
    if (!hasComment) {
      return
    }

    this.data.delete(id)
    // TODO
  }

  private walkComments(comments: CommentModel[]): CommentModel[] {
    const allComments = [] as CommentModel[]

    const walkChild = (comment: CommentModel): CommentModel[] => {
      const allComments = [] as CommentModel[]
      if (comment.children.length) {
        return comment.children.reduce(
          (arr, child) => [...arr, child, ...walkChild(child)],
          allComments,
        )
      }

      return allComments
    }

    return comments.reduce((acc, comment) => {
      return [...acc, comment, ...walkChild(comment)]
    }, allComments)
  }

  reset() {
    this.commentIdMap.clear()
    this.comments.length = 0
    this.currentRefId = ''
  }
}
