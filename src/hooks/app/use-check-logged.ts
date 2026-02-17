import { message } from 'react-message-popup'

import { useUserStore } from '~/atoms/user'
import { apiClient } from '~/utils/client'
import { devtoolForbidden } from '~/utils/console'
import { getToken, removeToken, setToken } from '~/utils/cookie'

import { useThemeConfig } from './use-initial-data'

export const useCheckLogged = () => {
  const userStore = useUserStore.getState()

  const {
    function: {
      banDevtool: { enable: banDevtoolEnable },
    },
  } = useThemeConfig()
  return {
    async check() {
      return requestAnimationFrame(() => {
        const token = getToken()
        if (token) {
          ;(apiClient as any).user
            .checkTokenValid(token)
            .then(({ ok }) => {
              if (ok) {
                // refresh token
                ;(apiClient as any).user.proxy.login
                  .put()
                  .then((res: { token: string }) => {
                    userStore.setToken(res.token)
                    message.success(
                      `欢迎回来，${useUserStore.getState().master!.name}`,
                      1500,
                    )
                    setToken(res.token)
                  })
              } else {
                removeToken()
                message.warn('登录身份过期了，再登录一下吧！', 2000)
              }
            })
            .catch(() => {
              removeToken()
              message.warn('登录身份过期了，再登录一下吧！', 2000)
            })
        } else {
          if (banDevtoolEnable) {
            devtoolForbidden()
          }
        }
      })
    },
  }
}
