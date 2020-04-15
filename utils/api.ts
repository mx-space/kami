import $axios from './request'
import inflection from 'inflection'

export enum AccessRoutesEnum {
  Post,
  Category,
  Comment,
  Note,
  Page,
  Master,
  Menu,
  Project,
}

export const Rest = (rest: keyof typeof AccessRoutesEnum, prefix?: string) => {
  let pluralize = ['Master', 'Menu'].includes(rest)
    ? rest.toLowerCase()
    : inflection.pluralize(rest).toLowerCase()
  pluralize = prefix ? pluralize + `/${prefix}` : pluralize
  return {
    getRecently: async function <T = unknown>({
      page = 1,
      size = 10,
    }: { page?: number; size?: number } = {}): Promise<T> {
      const data = await $axios({
        method: 'GET',
        url: `/${pluralize}`,
        params: {
          page,
          size,
        },
      })
      return data as any
    },
    async getOne<T = unknown>(id?: string): Promise<T> {
      const data = await $axios.get(`${pluralize}/${id ?? ''}`)
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
    get del() {
      return this.deleteOne
    },
    get delete() {
      return this.deleteOne
    },
  }
}
