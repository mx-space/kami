import { useStore } from 'store'
import { getToken, removeToken } from 'utils'
import { apiClient } from 'utils/client'
import { message } from 'utils/message'

export const useCheckLogged = () => {
  const { userStore: master } = useStore()
  return {
    check() {
      return requestAnimationFrame(() => {
        const token = getToken()
        if (token) {
          apiClient.user.checkTokenValid(token).then(({ ok }) => {
            if (ok) {
              master.setToken(token)
              message.success('欢迎回来, ' + master.name, 1500)
            } else {
              removeToken()
              message.warn('登录身份过期了, 再登录一下吧!', 2)
            }
          })
        } else {
          // devtoolForbidden()
        }
      })
    },
  }
}
