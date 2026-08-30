import type { IncomingMessage } from 'http'
import { version } from 'react'

import type { AggregateRootWithTheme, PageModel } from '@mx-space/api-client'

import { defaultConfigs } from '~/configs.default'
import type { KamiConfig } from '~/types/config'
import { $axios, apiClient } from '~/utils/client'
import { isClientSide, isServerSide } from '~/utils/env'
import type { Locale } from '~/i18n/config'

import PKG from '../../package.json'
import type { InitialDataType } from '../provider'

export const attachRequestProxy = (request?: IncomingMessage) => {
  if (!request) {
    return
  }

  if (!isServerSide()) {
    return
  }

  let ip =
    ((request.headers['x-forwarded-for'] ||
      request.headers['X-Forwarded-For'] ||
      request.headers['X-Real-IP'] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress) as string) || undefined
  if (ip && ip.split(',').length > 0) {
    ip = ip.split(',')[0]
  }
  if (ip) $axios.defaults.headers.common['x-forwarded-for'] = ip as string

  $axios.defaults.headers.common[
    'User-Agent'
  ] = `${request.headers['user-agent']} NextJS/v${PKG.dependencies.next} Kami/${version}`

}

export async function fetchInitialData(locale: Locale): Promise<InitialDataType> {
  if (isClientSide() && window.data?.locale === locale) {
    return window.data
  }

  const themeName = process.env.NEXT_PUBLIC_SNIPPET_NAME || 'kami'
  const [aggregateDataState, pageMetaState] =
    await Promise.allSettled([
      apiClient.aggregate.proxy.get<AggregateRootWithTheme<KamiConfig>>({
        params: { theme: themeName, lang: locale },
      }),
      apiClient.page.getList(1, 20, { select: ['id', 'slug', 'title'] }),
    ])

  let aggregateData: AggregateRootWithTheme<KamiConfig> | null = null
  let configSnippet: KamiConfig | null = null
  let pageMeta: Pick<PageModel, 'id' | 'slug' | 'title'>[] = []
  let reason = undefined as undefined | string
  if (aggregateDataState.status === 'fulfilled') {
    aggregateData = aggregateDataState.value
  } else {
    //  TODO 请求异常处理
    reason = aggregateDataState?.reason
    console.error(`Fetch aggregate data error: ${aggregateDataState.reason}`)
  }

  if (aggregateDataState.status === 'fulfilled') {
    configSnippet = aggregateDataState.value.theme
      ? { ...aggregateDataState.value.theme }
      : (defaultConfigs as unknown as KamiConfig)
  } else {
    configSnippet = defaultConfigs as any
  }

  if (pageMetaState.status === 'fulfilled') {
    pageMeta = pageMetaState.value.data
  }

  // @ts-ignore
  return { aggregateData, config: configSnippet, pageMeta, locale, reason }
}
