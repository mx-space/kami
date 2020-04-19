import axios from 'axios'
import configs from 'configs'
import { message } from 'antd'
const service = axios.create({
  baseURL: process.env.apiUrl || configs.apiUrl || '/api',
  // withCredentials: true,
  timeout: 5000,
})

service.interceptors.request.use(
  (config) => {
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
    if (Array.isArray(error.response?.data?.msg)) {
      error.response?.data?.msg.map((m) => {
        message.error(m)
      })
    } else message.error(error.response?.data?.msg)
    return Promise.reject(error)
  },
)

export default service
