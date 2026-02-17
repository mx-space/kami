import type { FC } from 'react'
import { useTranslations } from 'next-intl'

import { API_URL } from '~/constants/env'

import { ErrorView } from '.'

export const NoDataErrorView: FC = () => {
  const t = useTranslations('error')
  return (
    <>
      <ErrorView
        noSeo
        statusCode={t('noData')}
        showBackButton={false}
        description={
          <>
            <p>{t('noDataDesc1')}</p>
            <p>{t('noDataDesc2')}</p>
            <p>{t('noDataApiUrl', { url: API_URL })}</p>
          </>
        }
      />

      <div
        className="absolute opacity-20 blur-15 filter inset-0 bg-center bg-cover"
        style={{
          backgroundImage: `url("https://fastly.jsdelivr.net/gh/mx-space/docs-images@master/images/chichi-1.jpeg")`,
        }}
      />
    </>
  )
}
