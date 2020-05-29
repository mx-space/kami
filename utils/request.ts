/*
 * @Author: Innei
 * @Date: 2020-05-07 16:04:24
 * @LastEditTime: 2020-05-29 20:23:00
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/request.ts
 * @MIT
 */

import { message } from 'antd'
import axios from 'axios'
import { getToken } from './auth'
import Package from 'package.json'
const service = axios.create({
  baseURL: process.env.APIURL || '/api',
  // withCredentials: true,
  // timeout: 5000,
})

service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = 'bearer ' + getToken()
    }
    if (typeof window === 'undefined') {
      // on node side
      config.headers['User-Agent'] =
        'mx-space server client' + ` v${Package.version}`
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
  (error) => {
    if (typeof document !== 'undefined') {
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          error.response.data.message.map((m) => {
            message.error(m)
          })
        } else message.error(error.response.data.message)
      } else {
        message.error('网络好像出现了点问题呢')
      }
    }

    return Promise.reject(error)
  },
)

export default service
