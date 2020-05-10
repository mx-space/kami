import $axios from 'utils/request'
import inflection from 'inflection'
import { AxiosRequestConfig } from 'axios'

declare enum AccessRoutesEnum {
  Aggregate,
  Category,
  Comment,
  Link,
  Master,
  Menu,
  Note,
  Page,
  Post,
  Project,
  Say,
}

interface Gets {
  page?: number
  size?: number
  select?: string
  state?: 0 | 1 | 2
  year?: number
  [key: string]: string | number | undefined
}

export const Rest = (rest: keyof typeof AccessRoutesEnum, prefix?: string) => {
  let pluralize = ['Master', 'Menu', 'Aggregate'].includes(rest)
    ? rest.toLowerCase()
    : inflection.pluralize(rest).toLowerCase()
  pluralize = prefix ? pluralize + `/${prefix}` : pluralize
  pluralize = encodeURI(pluralize)
  const apis = {
    async getRecently<T = unknown>({
      page,
      size,
      select,
      state,
      year,
      ...rest
    }: Gets = {}): Promise<T> {
      const data = await $axios({
        method: 'GET',
        url: `/${pluralize}`,
        params: {
          page: page || 1,
          size: size || 10,
          select,
          state,
          year,
          ...rest,
        },
      })
      return data as any
    },
    async getOne<T = unknown>(
      _id = '',
      config?: AxiosRequestConfig | undefined,
    ): Promise<T> {
      const id = encodeURI(_id)
      const data = await $axios.get(`${pluralize}${id ? '/' + id : ''}`, config)
      return data as any
    },
    async postNew<T = unknown>(body: Record<string, any>): Promise<T> {
      const data = await $axios.post(`${pluralize}`, body)
      return data as any
    },
    async modifyOne<T = unknown>(
      id: string,
      body: Record<string, any>,
    ): Promise<T> {
      const data = await $axios.put(`${pluralize}/${id}`, body)
      return data as any
    },
    async deleteOne<T = unknown>(id: string): Promise<T> {
      const data = await $axios.delete(`${pluralize}/${id}`)
      return data as any
    },
    get gets() {
      return this.getRecently
    },
    get get() {
      return this.getOne
    },
    get post() {
      return this.postNew
    },
    get update() {
      return this.modifyOne
    },
    async patch<T = unknown>(id: string, body: any): Promise<T> {
      const data = await $axios.patch(`${pluralize}/${id}`, body)
      return data as any
    },
    get del() {
      return this.deleteOne
    },
    get delete() {
      return this.deleteOne
    },
  }
  return apis
}
