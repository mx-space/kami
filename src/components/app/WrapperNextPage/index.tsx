import type { AxiosError } from 'axios'
import type { NextPage } from 'next'
import { wrapperNextPage as wrapper } from 'next-suspense'
import { useTranslations } from 'next-intl'

import { RequestError } from '@mx-space/api-client'

import { Loading } from '~/components/ui/Loading'
import { isNumber } from '~/utils/_'

import { ErrorView } from '../Error'

const LoadingComponent = () => <Loading />

function WrapperErrorComponent({ error }: { error: Error }) {
  const t = useTranslations('error')
  let code: any
  if (error instanceof RequestError) {
    const axiosError = error.raw as AxiosError
    code = isNumber(axiosError.response?.status)
      ? axiosError.response!.status
      : 408
  }
  return (
    <ErrorView
      statusCode={code ?? 'Error'}
      description={error?.message || t('requestFailed')}
      showRefreshButton
    />
  )
}

export function wrapperNextPage<T extends {}>(Page: NextPage<T>) {
  return wrapper(Page, {
    LoadingComponent,
    ErrorComponent: WrapperErrorComponent,
  })
}
