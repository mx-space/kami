import type {
  CategoryModel,
  NoteModel,
  PageModel,
  PostModel,
} from '@mx-space/api-client'

class UrlBuilder {
  isPostModel(model: any): model is PostModel {
    return (
      isDefined(model.title) && isDefined(model.slug) && !isDefined(model.order)
    )
  }

  isPageModel(model: any): model is PageModel {
    return (
      isDefined(model.title) && isDefined(model.slug) && isDefined(model.order)
    )
  }

  isNoteModel(model: any): model is NoteModel {
    return isDefined(model.title) && isDefined(model.nid)
  }

  build(model: PostModel | NoteModel | PageModel) {
    if (this.isPostModel(model)) {
      return `/posts/${
        (model.category as CategoryModel).slug
      }/${encodeURIComponent(model.slug)}`
    } else if (this.isPageModel(model)) {
      return `/${model.slug}`
    } else if (this.isNoteModel(model)) {
      return `/notes/${model.nid}`
    }

    return '/'
  }
}

function isDefined(data: any) {
  return data !== undefined && data !== null
}

export const urlBuilder = new UrlBuilder()
