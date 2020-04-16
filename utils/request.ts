import axios from 'axios'
import configs from 'configs'
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
      console.log(error)
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
    return Promise.reject(error)
  },
)

export default service
