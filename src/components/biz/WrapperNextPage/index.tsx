import type { NextPage, NextPageContext } from 'next'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { memo, useEffect, useState } from 'react'

import { Loading } from '~/components/universal/Loading'
import { isClientSide } from '~/utils/env'

const createMockContext = (router: NextRouter): NextPageContext => {
  return {
    AppTree: () => null,
    pathname: router.pathname,
    query: router.query,
    asPath: router.asPath,
  }
}

// only use once getInitialProps result from server fetch, because it will be reset after each fetch and fetch in csr.
let useServerPropsOnce = false
export function wrapperNextPage<T extends NextPage<any>>(NextPage: T) {
  if (isClientSide()) {
    const Page: NextPage<any> = memo((props) => {
      const router = useRouter()
      const [loading, setLoading] = useState(
        NextPage.getInitialProps ? true : false,
      )

      const [dataProps, setProps] = useState(!useServerPropsOnce ? props : null)

      useEffect(() => {
        if (!NextPage.getInitialProps) {
          setLoading(false)
          return
        }

        if (!useServerPropsOnce) {
          useServerPropsOnce = true
          setLoading(false)
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
              .catch(() => {
                // handle error
              })
          } else {
            setLoading(false)
            setProps(task)
          }
        } catch (err) {
          // handle error
        }
        // NOTE: if asPath change, re-fetch data but not set loading to `true`!!
      }, [router.asPath])

      if (!dataProps && loading) {
        return <Loading />
      }

      // @ts-ignore
      return <NextPage {...dataProps} />
    })

    return Page as T
  }

  return NextPage
}
