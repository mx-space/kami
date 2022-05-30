import { message } from 'react-message-popup'

import { useStore } from '~/store'
import { apiClient } from '~/utils/client'
import { devtoolForbidden } from '~/utils/console'
import { getToken, removeToken } from '~/utils/cookie'

import { useThemeConfig } from './use-initial-data'

export const useCheckLogged = () => {
  const { userStore: master } = useStore()
  const {
    function: {
      banDevtool: { enable: banDevtoolEnable },
    },
  } = useThemeConfig()
  return {
    check() {
      return requestAnimationFrame(() => {
        const token = getToken()
        if (token) {
          apiClient.user
            .checkTokenValid(token)
            .then(({ ok }) => {
              if (ok) {
                master.setToken(token)
                message.success(`欢迎回来, ${master.name}`, 1500)
              } else {
                removeToken()
                message.warn('登录身份过期了, 再登录一下吧!', 2000)
              }
            })
            .catch(() => {
              removeToken()
              message.warn('登录身份过期了, 再登录一下吧!', 2000)
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
