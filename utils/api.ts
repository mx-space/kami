import inflection from 'inflection'
import { Options } from 'ky/distribution/types/options'
import { omitBy } from 'lodash'
import { ky$ } from 'utils/request'

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
  Recently,
  Option,
}

interface Gets {
  page?: number
  size?: number
  select?: string
  state?: 0 | 1 | 2
  year?: number
  [key: string]: string | number | undefined
}

export const Rest = (
  rest: keyof typeof AccessRoutesEnum,
  prefix?: string,
  kyOption: Options = {},
) => {
  let pluralize = ['Master', 'Menu', 'Aggregate', 'Recently'].includes(rest)
    ? rest.toLowerCase()
    : inflection.pluralize(rest).toLowerCase()
  pluralize = prefix ? pluralize + `/${prefix}` : pluralize
  pluralize = encodeURI(pluralize).replace(/^\//, '')
  const apis = {
    async getRecently<T = unknown>({
      page,
      size,
      select,
      state,
      year,
      ...rest
    }: Gets = {}): Promise<T> {
      const res = await ky$.get(`${pluralize}`, {
        searchParams: new URLSearchParams(
          // @ts-ignore
          omitBy(
            {
              page: page || 1,
              size: size || 10,
              select,
              state,
              year,
              ...rest,
            },
            (i) => typeof i == 'undefined',
          ),
        ),
        ...kyOption,
      })
      return res.json() as any
    },
    async getOne<T = unknown>(
      id = '',
      config?: (Options & { params: Record<string, any> }) | undefined,
    ): Promise<T> {
      id = encodeURI(id)

      // axios compatibly
      // handle params
      let searchParams
      if (config?.params) {
        searchParams = new URLSearchParams(
          omitBy({ ...config?.params }, (i) => typeof i == 'undefined'),
        )
      }

      const res = await ky$.get(`${pluralize}${id ? '/' + id : ''}`, {
        ...config,
        searchParams,
      })
      return res.json() as any
    },
    async postNew<T = unknown>(body: Record<string, any>): Promise<T> {
      const res = await ky$.post(`${pluralize}`, { json: body, ...kyOption })
      return res.json() as any
    },
    async modifyOne<T = unknown>(
      id: string,
      body: Record<string, any>,
    ): Promise<T> {
      const res = await ky$.put(`${pluralize}/${id}`, {
        json: body,
        ...kyOption,
      })
      return res.json() as any
    },
    async patch<T = unknown>(id: string, body: any): Promise<T> {
      const res = await ky$.patch(`${pluralize}/${id}`, {
        json: body,
        ...kyOption,
      })
      return res.json() as any
    },
    async deleteOne<T = unknown>(id: string): Promise<T> {
      const res = await ky$.delete(`${pluralize}/${id}`, kyOption)
      return res.json() as any
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
  return apis
}
// @ts-ignore
globalThis.api = Rest
