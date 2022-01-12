import { RequestError } from '@mx-space/api-client'
import { ErrorView } from 'components/universal/Error'
import { isNumber } from 'lodash-es'
import { NextPage } from 'next'
import { useEffect } from 'react'

const ErrorPage: NextPage<{ statusCode: number; err: any }> = ({
  statusCode = 500,
  err,
}) => {
  useEffect(() => {
    console.log('[ErrorPage]: ', statusCode, err)
  }, [])
  return <ErrorView showBackButton showRefreshButton statusCode={statusCode} />
}

const getCode = (err, res): number => {
  if (!err && !res) {
    return 500
  }
  if (err instanceof RequestError) {
    // status maybe  ECONNREFUSED
    return isNumber(err.status) ? err.status : 408
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

ErrorPage.getInitialProps = async ({ res, err }) => {
  const statusCode = +getCode(err, res) || 500

  res && (res.statusCode = statusCode)
  if (statusCode === 404) {
    return { statusCode: 404, err }
  }
  return { statusCode, err } as {
    statusCode: number
    err: any
  }
}

export default ErrorPage
