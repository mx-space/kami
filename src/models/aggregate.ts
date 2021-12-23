/*
 * @Author: Innei
 * @Date: 2021-05-06 22:26:07
 * @LastEditTime: 2021-08-29 15:22:33
 * @LastEditors: Innei
 * @FilePath: /web/models/aggregate.ts
 * Mark: Coding with Love
 */
/* eslint-disable @typescript-eslint/no-namespace */
import { BaseRespModel } from './base'
import { CategoryModel } from './category'
import { UserDto } from './user'

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
