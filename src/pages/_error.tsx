import type { AxiosError } from 'axios'
import type { NextPage, NextPageContext } from 'next'
import { NextSeo } from 'next-seo'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { RequestError } from '@mx-space/api-client'
import { captureUnderscoreErrorException } from '@sentry/nextjs'
import { errorToText, ErrorView } from '~/components/app/Error'
import { useIsClient } from '~/hooks/common/use-is-client'
import { isNumber } from '~/utils/_'

const ErrorPage: NextPage<{ statusCode: number; err: any }> = ({
  statusCode = 500,
  err,
}) => {
  const t = useTranslations('error')
  useEffect(() => {
    console.log('[ErrorPage]: ', statusCode, err)
    // if (err) {
    //   const errMessage = err._message || err.message

    // if (errMessage) {
    //   message.error(errMessage)
    // }
    // }
  }, [err, statusCode])

  const isClient = useIsClient()
  const parseCodeInTitle = 'document' in globalThis && parseInt(document.title)
  const isValidStatusCode = isNumber(parseCodeInTitle) && statusCode >= 400
  // FIXME error page hydrate error, cause error data not equal to server side.
  return isClient ? (
    <ErrorView
      showBackButton
      showRefreshButton
      statusCode={isValidStatusCode ? parseCodeInTitle : statusCode}
    />
  ) : (
    <NextSeo title={`${statusCode.toString()} - ${t(errorToText(statusCode))}`} />
  )
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
ErrorPage.getInitialProps = async (ctx: NextPageContext) => {
  const { res, err } = ctx
  await captureUnderscoreErrorException(ctx)

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
    err?.message ||
    (err as any)?.response?.data?.message

  return { statusCode, err: serializeErr } as {
    statusCode: number
    err: any
  }
}

export default ErrorPage
