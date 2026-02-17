import type { FC } from 'react'
import { useTranslations } from 'next-intl'

import { ErrorView } from '.'

export const NoConfigErrorView: FC = () => {
  const t = useTranslations('error')
  return (
    <ErrorView
      statusCode={408}
      showBackButton={false}
      description={
        <>
          <p>{t('noConfigDesc1')}</p>
          <p>{t('noConfigDesc2')}</p>
        </>
      }
    />
  )
}
