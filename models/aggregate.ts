import { BaseRespModel } from './dto/base'
import { UserDto } from './dto/user'
import { CategoryModel } from './dto/category'

export namespace Top {
  export interface Note {
    _id: string
    title: string
    nid: number
  }

  export interface Post {
    _id: string
    title: string
    slug: string
  }

  export interface Project {
    _id: string
    name: string
    avatar: string
  }
  export interface Say {
    _id: string
    source: string
    text: string
    author: string
    created: Date
    modified: Date
    id: string
  }
  export interface Aggregate {
    notes: Note[]
    posts: Post[]
    projects: Project[]
    says: Say[]
  }
}
export interface Seo {
  title: string
  description: string
  keywords: string[]
}

interface PageMeta {
  _id: string
  title: string
  slug: string
  order?: number
}

export interface AggregateResp extends BaseRespModel {
  user: UserDto
  seo: Seo
  categories: CategoryModel[]
  pageMeta: PageMeta[]
}
