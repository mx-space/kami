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
          const showWelcomeBack = () => {
            const name = useUserStore.getState().master?.name
            if (name) {
              message.success(`欢迎回来，${name}`, 1500)
            }
          }
          apiClient.owner
            .checkTokenValid(token)
            .then(({ ok }) => {
              if (ok) {
                apiClient.owner
                  .getSession()
                  .then((session) => {
                    const newToken = session?.session?.token
                    if (newToken) {
                      userStore.setToken(newToken)
                      setToken(newToken)
                    }
                    showWelcomeBack()
                  })
                  .catch(showWelcomeBack)
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
