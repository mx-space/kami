import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import axios, { CanceledError } from 'axios'
import { message } from 'react-message-popup'

import type { IRequestAdapter } from '@mx-space/api-client'
import createClient, { allControllers } from '@mx-space/api-client'

import { API_URL } from '~/constants/env'
import { useNetworkStore } from '~/atoms/network'

import { getToken } from './cookie'
import { isClientSide } from './env'
import { log, reportError } from './logger'
import { MemoryCache } from './request/cache'
import { calcBackoffDelay, defaultRetryConfig, sleep } from './request/retry'

const genUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const uuid = genUUID()

export const $axios: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

type RequestMeta = {
  silentLoading?: boolean
  retry?: {
    maxRetries?: number
  }
  cache?: {
    ttlMs?: number
  }
}

type RequestConfigWithMeta = InternalAxiosRequestConfig & {
  meta?: RequestMeta
  __networkBegan?: boolean
  __retryAttempt?: number
}

const cache = new MemoryCache()
const inflight = new Map<string, Promise<any>>()

const buildRequestKey = (config: InternalAxiosRequestConfig) => {
  const method = (config.method || 'get').toLowerCase()
  const url = config.url || ''
  const params = config.params ? JSON.stringify(config.params) : ''
  const data = config.data ? JSON.stringify(config.data) : ''
  return `${method}:${url}?${params}#${data}`
}

const shouldRetry = (error: AxiosError, config: RequestConfigWithMeta) => {
  if (config.meta?.retry?.maxRetries === 0) return false
  const method = (config.method || 'get').toLowerCase()
  if (!['get', 'head', 'options'].includes(method)) return false
  if (error instanceof CanceledError) return false
  const status = error.response?.status
  if (status && status >= 400 && status < 500 && status !== 408) return false
  return true
}

const getBizMessageFromAxiosError = (
  error: AxiosError<Record<string, any> | undefined>,
) => {
  const response = error.response
  const data = response?.data
  const raw = data?.message
  if (typeof raw === 'string') return raw
  if (Array.isArray(raw)) return raw[0]
  return undefined
}

$axios.interceptors.request.use((rawConfig) => {
  const config = rawConfig as RequestConfigWithMeta

  const token = getToken()
  if (config.headers) {
    if (token) {
      config.headers['Authorization'] = token
    }
    config.headers['x-uuid'] = uuid
  }

  if (isClientSide() && !config.meta?.silentLoading) {
    useNetworkStore.getState().beginRequest()
    config.__networkBegan = true
  }

  return config
})

const endNetworkIfNeeded = (config?: RequestConfigWithMeta) => {
  if (config?.__networkBegan) {
    useNetworkStore.getState().endRequest()
  }
}

$axios.interceptors.response.use(
  (response) => {
    endNetworkIfNeeded(response.config as any)
    return response
  },
  async (error: AxiosError<Record<string, any> | undefined>) => {
    const config = (error.config || {}) as RequestConfigWithMeta

    if (shouldRetry(error, config)) {
      const maxRetries =
        config.meta?.retry?.maxRetries ?? defaultRetryConfig.maxRetries
      const attempt = config.__retryAttempt ?? 0
      if (attempt < maxRetries) {
        config.__retryAttempt = attempt + 1
        const delay = calcBackoffDelay(attempt, defaultRetryConfig)
        await sleep(delay)
        return $axios.request(config)
      }
    }

    endNetworkIfNeeded(config)

    if (error instanceof CanceledError) {
      return Promise.reject(error)
    }

    if (process.env.NODE_ENV === 'development') {
      log('warn', error.message)
    }

    const status = error.response?.status
    if (!status || status >= 500 || status === 408 || error.code === 'ECONNABORTED') {
      reportError(error, {
        source: 'axios',
        status,
        code: error.code,
        method: config.method,
        url: config.url,
      })
    }
    if (!status || status === 408 || error.code === 'ECONNABORTED') {
      if (isClientSide()) {
        message.error('请求超时，请检查一下网络哦！')
      } else {
        const msg = '上游服务器请求超时'
        message.error(msg)
        log('error', msg, error.message)
      }
    } else if (status === 401) {
      if (isClientSide()) {
        message.error('登录已过期或未授权')
      }
    } else {
      const bizMessage = getBizMessageFromAxiosError(error)
      if (bizMessage && isClientSide()) {
        message.error(bizMessage)
      } else if (isClientSide() && status >= 500) {
        message.error('服务暂时不可用，请稍后再试')
      }
    }

    return Promise.reject(error)
  },
)

const requestWithCache = async <T>(config: RequestConfigWithMeta) => {
  const method = (config.method || 'get').toLowerCase()
  const key = buildRequestKey(config)

  if (method === 'get') {
    const ttlMs =
      config.meta?.cache?.ttlMs ??
      (typeof config.url === 'string' &&
      (config.url.includes('/aggregate') || config.url.includes('/snippet'))
        ? 10_000
        : 0)

    if (ttlMs > 0) {
      const cached = cache.get<T>(key)
      if (cached !== undefined) return cached
    }

    const existing = inflight.get(key)
    if (existing) return existing as Promise<T>

    const p = $axios.request<T>(config).then((res) => {
      const ttl = ttlMs
      if (ttl > 0) {
        cache.set(key, res.data, ttl)
      }
      inflight.delete(key)
      return res.data
    })
    inflight.set(key, p as Promise<any>)
    return p
  }

  const res = await $axios.request<T>(config)
  return res.data
}

export const createAxiosAdapter = (
  axiosInstance: AxiosInstance,
): IRequestAdapter<AxiosInstance> => ({
  default: axiosInstance,
  get(url: string, options) {
    return requestWithCache({
      url,
      method: 'get',
      params: options?.params,
      meta: (options as any)?.meta,
    } as any)
  },
  post(url: string, options) {
    return requestWithCache({
      url,
      method: 'post',
      params: options?.params,
      data: options?.data,
      meta: (options as any)?.meta,
    } as any)
  },
  put(url: string, options) {
    return requestWithCache({
      url,
      method: 'put',
      params: options?.params,
      data: options?.data,
      meta: (options as any)?.meta,
    } as any)
  },
  patch(url: string, options) {
    return requestWithCache({
      url,
      method: 'patch',
      params: options?.params,
      data: options?.data,
      meta: (options as any)?.meta,
    } as any)
  },
  delete(url: string, options) {
    return requestWithCache({
      url,
      method: 'delete',
      params: options?.params,
      data: options?.data,
      meta: (options as any)?.meta,
    } as any)
  },
})

export const apiClient = createClient(createAxiosAdapter($axios))(API_URL, {
  controllers: allControllers,
  getDataFromResponse(response) {
    return response as any
  },
})
