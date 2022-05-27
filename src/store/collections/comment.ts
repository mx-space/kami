import { action, computed, makeObservable, observable } from 'mobx'
import { apiClient } from 'utils'

import type { CommentModel } from '@mx-space/api-client'

import { Store } from '../helper/base'

export class CommentStore extends Store<CommentModel> {
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
    })
  }
  currentRefId = ''
  comments = [] as CommentModel[]

  get commentIdMap() {
    return this.data
  }

  async fetchComment(refId: string, page = 1, size = 10) {
    const data = await apiClient.comment.getByRefId(refId, {
      page,
      size,
    })

    this.currentRefId = refId
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
    if (comment.ref !== this.currentRefId) {
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
      this.comments.unshift(comment)

      this.walkComments(comment.children).forEach((child) => {
        this.commentIdMap.set(child.id, child)
      })
    }

    return comment
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
