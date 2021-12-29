import { ErrorView } from 'components/Error'
import { NextPage } from 'next'

const ErrorPage: NextPage<{ statusCode: number }> = ({ statusCode = 500 }) => {
  return <ErrorView showBackButton showRefreshButton statusCode={statusCode} />
}

const getCode = (err, res): number => {
  if (!err && !res) {
    return 500
  }
  if (res?.statusCode === 500 && err?.statusCode === 500) {
    return 500
  } else if (res && res.statusCode !== 500) {
    return res.statusCode
  } else if (err && err.statusCode !== 500) {
    return err.statusCode
  }
  return 500
}

ErrorPage.getInitialProps = async ({ res, err }) => {
  const statusCode = getCode(err, res)
  if (statusCode === 404) {
    // Opinionated: do not record an exception in Sentry for 404
    return { statusCode: 404 }
  }

  return { statusCode } as {
    statusCode: number
  }
}

export default ErrorPage
