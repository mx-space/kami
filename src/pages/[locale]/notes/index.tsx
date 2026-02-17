import type { NextPage } from 'next'
import { useEffect } from 'react'

import { getLocaleFromContext, useRouter } from '~/i18n/navigation'
import { setRequestLocale } from '~/utils/client'

const RedirectView: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.replace('/notes/latest')
  }, [])

  return null
}

RedirectView.getInitialProps = async (ctx) => {
  setRequestLocale(getLocaleFromContext(ctx))
  const { res } = ctx
  if (!res) {
    return {}
  }
  const locale = getLocaleFromContext(ctx)
  const location =
    locale && locale !== 'zh' ? `/${locale}/notes/latest` : '/notes/latest'
  res
    .writeHead(301, {
      Location: location,
    })
    .end()

  return {}
}

export default RedirectView
