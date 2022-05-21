import type { AxiosError } from 'axios'
import { ErrorView } from 'components/universal/Error'
import { isNumber } from 'lodash-es'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { message } from 'react-message-popup'

import { RequestError } from '@mx-space/api-client'

const ErrorPage: NextPage<{ statusCode: number; err: any }> = ({
  statusCode = 500,
  err,
}) => {
  useEffect(() => {
    console.log('[ErrorPage]: ', statusCode, err)
    if (err) {
      const errMessage = err._message || err.message

      if (errMessage) {
        message.error(errMessage)
      }
    }
  }, [err, statusCode])
  return <ErrorView showBackButton showRefreshButton statusCode={statusCode} />
}

const getCode = (err, res): number => {
  if (!err && !res) {
    return 500
  }
  if (err instanceof RequestError) {
    // @see:  https://github.com/axios/axios/pull/3645
    const axiosError = err.raw as AxiosError

    return isNumber(axiosError.response?.status)
      ? axiosError.response!.status
      : 408
  }
  if (res?.statusCode === 500 && err?.statusCode === 500) {
    return 500
  } else if (res && res.statusCode !== 500) {
    return res.statusCode || 500
  } else if (err && err.statusCode !== 500) {
    return err.statusCode || 500
  }
  return 500
}

ErrorPage.getInitialProps = async ({ res, err }: any) => {
  const statusCode = +getCode(err, res) || 500

  res && (res.statusCode = statusCode)
  if (statusCode === 404) {
    return { statusCode: 404, err }
  }
  const serializeErr: any = (() => {
    try {
      return JSON.parse(JSON.stringify(err))
    } catch (e: any) {
      console.log(e.message)

      return err
    }
  })()
  serializeErr['_message'] =
    (err as any)?.raw?.response?.data?.message ||
    err.message ||
    err.response?.data?.message

  return { statusCode, err: serializeErr } as {
    statusCode: number
    err: any
  }
}

export default ErrorPage
