import { BaseRespModel } from './base'
import { UserDto } from './user'
import { CategoryModel } from './category'

export namespace Top {
  export interface Note {
    id: string
    title: string
    nid: number
  }

  export interface Post {
    id: string
    title: string
    slug: string
    category: {
      name: string
      slug: string
    }
  }

  export interface Project {
    id: string
    name: string
    avatar: string
  }
  export interface Say {
    id: string
    source: string
    text: string
    author: string
    created: Date
    modified: Date
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
  id: string
  title: string
  slug: string
  order?: number
}

export namespace RandomImage {
  export interface Dimensions {
    height: number
    width: number
    type: string
  }

  export enum Locate {
    Local,
    Online,
  }
  export interface Image {
    id: string
    name: string
    dimensions: Dimensions
    filename: string
    mime: string
    type: number
    locate?: Locate
    url?: string
  }
}

export interface AggregateResp extends BaseRespModel {
  user: UserDto
  seo: Seo
  categories: CategoryModel[]
  pageMeta: PageMeta[]
  lastestNoteNid: number
}
