import type { AxiosError } from 'axios'
import { isNumber } from 'lodash-es'
import type { NextPage, NextPageContext } from 'next'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { RequestError } from '@mx-space/api-client'

import { Loading } from '~/components/universal/Loading'
import { isClientSide } from '~/utils/env'

import { ErrorView } from '../Error'

const createMockContext = (router: NextRouter): NextPageContext => {
  return {
    AppTree: () => null,
    pathname: router.pathname,
    query: router.query,
    asPath: router.asPath,
  }
}

export function wrapperNextPage<T extends NextPage<any>>(NextPage: T) {
  if (isClientSide()) {
    const Page: FC<any> = () => {
      const router = useRouter()
      const [loading, setLoading] = useState(
        NextPage.getInitialProps ? true : false,
      )

      const [error, setError] = useState<any>(null)

      const [dataProps, setProps] = useState(null)

      useEffect(() => {
        if (!NextPage.getInitialProps) {
          return
        }

        try {
          const task = NextPage.getInitialProps(createMockContext(router))
          const isPromise = task.then
          if (isPromise) {
            task
              .then((data) => {
                setLoading(false)
                setProps(data)
              })
              .catch((err) => {
                setLoading(false)
                setError(err)
              })
          } else {
            setLoading(false)
            setProps(task)
          }
        } catch (err: any) {
          setLoading(false)
          setError(err)
        }
      }, [])

      if (error) {
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
          ></ErrorView>
        )
      }

      if (!dataProps && loading) {
        return <Loading />
      }

      // @ts-ignore
      return <NextPage {...dataProps} />
    }
    return Page as T
  }

  return NextPage
}
