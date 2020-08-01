/*
 * @Author: Innei
 * @Date: 2020-05-07 16:04:24
 * @LastEditTime: 2020-08-01 15:23:03
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/request.ts
 * @MIT
 */

import { message } from 'antd'
import axios, { AxiosError } from 'axios'
import { getToken } from './auth'
import { isClientSide, isServerSide } from './utils'
const service = axios.create({
  baseURL: process.env.APIURL || '/api',
  // withCredentials: true,
  timeout: 5000,
})

service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = 'bearer ' + getToken()
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

service.interceptors.response.use(
  (response) => {
    const res = response.data
    return res
  },
  (error: AxiosError<Record<string, any> | undefined>) => {
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
        Promise.reject({
          statusCode,
          data,
          message: data,
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

    return Promise.reject({
      statusCode: error.response.status,
      data: error.response.data,
    })
  },
)

export default service
