import type { NextPage } from 'next'
import { useTranslations } from 'next-intl'

import { Seo } from '~/components/app/Seo'
import { useRouter } from '~/i18n/navigation'
import { isNumber } from '~/utils/_'
import { isServerSide } from '~/utils/env'

import styles from './index.module.css'

function getErrorKey(statusCode: number): keyof typeof ERROR_KEYS {
  switch (statusCode) {
    case 404:
      return '404'
    case 403:
      return '403'
    case 401:
      return '401'
    case 408:
      return isServerSide() ? '504' : 'timeout'
    case 406:
    case 418:
      return '502'
    case 666:
      return 'unknown'
    case 500:
    default:
      return 'generic'
  }
}

// Used in keyof typeof ERROR_KEYS type
// eslint-disable-next-line unused-imports/no-unused-vars -- type-only use
const ERROR_KEYS = {
  '404': '404',
  '403': '403',
  '401': '401',
  '504': '504',
  timeout: 'timeout',
  '502': '502',
  unknown: 'unknown',
  generic: 'generic',
} as const

export const errorToText = (statusCode: number) => getErrorKey(statusCode)

export const ErrorView: NextPage<{
  statusCode: number | string
  showBackButton?: boolean
  showRefreshButton?: boolean
  description?: string | JSX.Element
  noSeo?: boolean
}> = ({
  statusCode = 500,
  showBackButton = true,
  showRefreshButton = true,
  description,
  noSeo = false,
}) => {
  const t = useTranslations('error')
  const router = useRouter()
  const code = isNumber(statusCode) ? statusCode : 500
  const message = t(errorToText(code))
  return (
    <div className={styles['error']}>
      {!noSeo && <Seo title={message} />}
      <div>
        <h1>{statusCode}</h1>
        <div className={styles['desc']}>
          {description ?? <h2>{message}</h2>}
        </div>
      </div>
      {showBackButton || showRefreshButton ? (
        <div className="mt-5">
          {showBackButton ? (
            <button className="btn red mr-3" onClick={() => router.push('/')}>
              {t('backToHome')}
            </button>
          ) : null}
          {showRefreshButton ? (
            <button className="btn yellow" onClick={() => router.reload()}>
              {t('refresh')}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
