import { allControllers, createClient } from '@mx-space/api-client'
import { axiosAdaptor } from '@mx-space/api-client/lib/adaptors/axios'
import { AxiosError } from 'axios'
import { API_URL } from 'constants/env'
import { getToken } from './cookie'
import { message } from './message'
import { isClientSide, isServerSide } from './utils'

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
    console.log(error)

    // 处理网络中断的问题
    if (
      !error.response ||
      error.response.status === 408 ||
      error.code === 'ECONNABORTED'
    ) {
      const next = ({
        data,
        statusCode,
      }: {
        data?: string
        statusCode?: number
      }) => {
        if (typeof document !== 'undefined') {
          data && message.error(data)
        }
        return Promise.reject({
          statusCode,
          data,
          message: data,
          toString() {
            return '网络错误'
          },
        })
      }

      return next({
        statusCode: 408,
        data: isServerSide()
          ? '上游服务器连接超时'
          : '连接超时, 请检查一下网络哦!',
      })
    }
    if (isClientSide()) {
      if (error.response.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          error.response.data.message.map((m) => {
            message.error(m)
          })
        } else message.error(error.response.data.message)
      } else {
        message.error('网络好像出现了点问题呢')
      }
    }
    const code = error.response.status
    return Promise.reject({
      statusCode: code,
      data: error.response.data,
      toString() {
        return '请求错误: ' + `[${code}]: Fetch ${error.config.url}`
      },
    })
  },
)
