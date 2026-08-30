import type { AxiosError, AxiosInstance } from 'axios'
import { CanceledError } from 'axios'
import { message } from 'react-message-popup'

import { allControllers, createClient } from '@mx-space/api-client'
import { defaultLocale, enabledLocaleSet } from '~/i18n/config'
import { isClientSide } from './env'
import { API_URL } from '~/constants/env'

// Importing this way as subpath has no type declarations under current moduleResolution.
// @ts-expect-error: no type declarations for this subpath
import * as axiosAdaptorImport from '@mx-space/api-client/dist/adaptors/axios'
const axiosAdaptor = axiosAdaptorImport.axiosAdaptor as typeof axiosAdaptorImport.axiosAdaptor & {
  default: AxiosInstance
}


const genUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const apiClient = createClient(axiosAdaptor as any)(API_URL, {
  controllers: allControllers,
})

const uuid = genUUID()

export const $axios = axiosAdaptor.default as AxiosInstance

$axios.defaults.timeout = 10000
$axios.defaults.withCredentials = true

/**
 * Current browser locale for API requests (set by LangSyncProvider).
 *
 * This value is deliberately client-only: a module global is unsafe for
 * concurrent SSR. Server callers must pass `lang` with the individual
 * request instead.
 */
let requestLocale: string | null = null

export function setRequestLocale(locale: string | null) {
  if (!isClientSide()) {
    return
  }
  requestLocale = locale
}

export function getRequestLocale() {
  return requestLocale
}

const getBrowserUrlLocale = () => {
  if (!isClientSide()) {
    return null
  }
  const firstPathSegment = window.location.pathname.split('/').filter(Boolean)[0]
  return firstPathSegment && enabledLocaleSet.has(firstPathSegment)
    ? firstPathSegment
    : defaultLocale
}

const hasLangParam = (params: unknown) => {
  if (params instanceof URLSearchParams) {
    return params.has('lang')
  }
  if (typeof params === 'string') {
    return /(?:^|[?&])lang=/.test(params)
  }
  return !!params && typeof params === 'object' && 'lang' in params
}

const urlHasLangParam = (url: string | undefined) =>
  !!url && /[?&]lang=/.test(url)

$axios.interceptors.request.use((config) => {
  config.headers = config.headers ?? {}
  config.headers['x-uuid'] = uuid
  const isGetRequest = (config.method ?? 'get').toLowerCase() === 'get'
  const locale = getBrowserUrlLocale() ?? requestLocale
  if (locale) {
    config.headers['x-lang'] = locale
    if (
      isGetRequest &&
      !hasLangParam(config.params) &&
      !urlHasLangParam(config.url)
    ) {
      config.params = { ...config.params, lang: locale }
    }
  } else if ('x-lang' in config.headers) {
    delete config.headers['x-lang']
  }

  return config
})

$axios.interceptors.response.use(
  undefined,
  (error: AxiosError<Record<string, any> | undefined>) => {
    if (error instanceof CanceledError) {
      return Promise.reject(error)
    }

    if (process.env.NODE_ENV === 'development') {
      console.error(error.message)
    }

    if (
      !error.response ||
      error.response.status === 408 ||
      error.code === 'ECONNABORTED'
    ) {
      if (isClientSide()) {
        message.error('请求超时，请检查一下网络哦！')
      } else {
        const msg = '上游服务器请求超时'
        message.error(msg)
        console.error(msg, error.message)
      }
    }

    const response = error.response
    if (response) {
      const data = response.data
      if (response.status !== 401 && data && data.message) {
        message.error(
          typeof data.message == 'string'
            ? data.message
            : Array.isArray(data.message)
              ? data.message[0]
              : '请求错误',
        )
      }
    }

    return Promise.reject(error)
  },
)
