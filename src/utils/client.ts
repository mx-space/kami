import { allControllers, createClient } from '@mx-space/api-client'
import { axiosAdaptor } from '@mx-space/api-client/lib/adaptors/axios'
import { AxiosError } from 'axios'
import { API_URL } from 'constants/env'
import { getToken } from './cookie'
import { message } from './message'
import { isClientSide } from './utils'

export const apiClient = createClient(axiosAdaptor)(API_URL, {
  controllers: allControllers,
})

export const $axios = axiosAdaptor.default

$axios.defaults.timeout = 10000

$axios.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers['Authorization'] = 'bearer ' + token
    }

    return config
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error.message)
    }

    return Promise.reject(error)
  },
)

$axios.interceptors.response.use(
  undefined,
  (error: AxiosError<Record<string, any> | undefined>) => {
    if (
      !error.response ||
      error.response.status === 408 ||
      error.code === 'ECONNABORTED'
    ) {
      if (isClientSide()) {
        message.error('请求超时, 请检查一下网络哦!')
      } else {
        console.error('上游服务器请求超时', error.message)
      }
    }

    return Promise.reject(error)
  },
)
