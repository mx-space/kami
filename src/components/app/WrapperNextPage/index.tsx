import type { AxiosError } from 'axios'
import type { NextPage } from 'next'
import { wrapperNextPage as wrapper } from 'next-suspense'

import { RequestError } from '@mx-space/api-client'

import { Loading } from '~/components/ui/Loading'
import { isNumber } from '~/utils/_'

import { ErrorView } from '../Error'

const LoadingComponent = () => <Loading />
export function wrapperNextPage<T extends {}>(Page: NextPage<T>) {
  return wrapper(Page, {
    LoadingComponent,
    ErrorComponent: ({ error }) => {
      let code: any
      if (error instanceof RequestError) {
        // @see:  https://github.com/axios/axios/pull/3645
        const axiosError = error.raw as AxiosError

        code = isNumber(axiosError.response?.status)
          ? axiosError.response!.status
          : 408
      }

      return (
        <ErrorView
          statusCode={code ?? 'Error'}
          description={error?.message || '请求出错了'}
          showRefreshButton
        />
      )
    },
  })
}
