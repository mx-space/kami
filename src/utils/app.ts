import { headers } from 'next/headers'
import { version } from 'react'

import type { AggregateRoot } from '@mx-space/api-client'

import { defaultConfigs } from '~/configs.default'
import type { KamiConfig } from '~/types/config'
import { $axios, apiClient } from '~/utils/client'
import { TokenKey } from '~/utils/cookie'
import { isClientSide, isServerSide } from '~/utils/env'

import PKG from '../../package.json'
import type { InitialDataType } from '../context'

export const attachRequestProxy = () => {
  if (!isServerSide()) {
    return
  }

  const headersInst = headers()

  let ip =
    headersInst.get('x-forwarded-for') ||
    headersInst.get('X-Forwarded-For') ||
    headersInst.get('X-Real-IP') ||
    headersInst.get('x-real-ip')

  if (ip && ip.split(',').length > 0) {
    ip = ip.split(',')[0]
  }
  ip && ($axios.defaults.headers.common['x-forwarded-for'] = ip as string)

  $axios.defaults.headers.common['User-Agent'] = `${headersInst.get(
    'user-agent',
  )} NextJS/v${PKG.dependencies.next} Kami/${version}`

  // forward auth token
  const cookie = headersInst.get('cookie')
  if (cookie) {
    const token = cookie
      .split(';')
      .find((str) => {
        const [key] = str.split('=')

        return key === TokenKey
      })
      ?.split('=')[1]
    if (token) {
      $axios.defaults.headers['Authorization'] = `bearer ${token.replace(
        /^Bearer\s/i,
        '',
      )}`
    }
  }
}

export async function fetchInitialData(): Promise<InitialDataType> {
  if (isClientSide() && window.data) {
    return window.data
  }

  attachRequestProxy()
  const [aggregateDataState, configSnippetState] = await Promise.allSettled([
    apiClient.aggregate.getAggregateData(),
    apiClient.snippet.getByReferenceAndName<KamiConfig>(
      'theme',
      process.env.NEXT_PUBLIC_SNIPPET_NAME || 'kami',
    ),
  ])

  let aggregateData: AggregateRoot | null = null
  let configSnippet: KamiConfig | null = null
  let reason = undefined as undefined | string
  if (aggregateDataState.status === 'fulfilled') {
    aggregateData = aggregateDataState.value
  } else {
    //  TODO 请求异常处理
    reason = aggregateDataState?.reason
    console.error(`Fetch aggregate data error: ${aggregateDataState.reason}`)
  }

  if (configSnippetState.status === 'fulfilled') {
    configSnippet = { ...configSnippetState.value }
  } else {
    configSnippet = defaultConfigs as any
  }

  // @ts-ignore
  return { aggregateData, config: configSnippet, reason }
}
