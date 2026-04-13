import type { AxiosError } from 'axios'
import { message } from 'react-message-popup'

import { useUserStore } from '~/atoms/user'
import { hasActiveSession } from '~/utils/auth'
import { apiClient } from '~/utils/client'
import { devtoolForbidden } from '~/utils/console'

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
        const clearLoginState = (notify = false) => {
          const wasLogged = useUserStore.getState().isLogged
          userStore.setLoggedIn(false)
          if (notify && wasLogged) {
            message.warn('登录身份过期了，再登录一下吧！', 2000)
          }
        }

        const showWelcomeBack = () => {
          const name = useUserStore.getState().master?.name
          if (name) {
            message.success(`欢迎回来，${name}`, 1500)
          }
        }

        const applySession = (
          session: Awaited<ReturnType<typeof apiClient.owner.getSession>>,
        ) => {
          if (hasActiveSession(session)) {
            userStore.setLoggedIn(true)
            showWelcomeBack()
            return
          }
          clearLoginState()
          if (banDevtoolEnable) {
            devtoolForbidden()
          }
        }

        const handleSessionError = (error: unknown, retried = false) => {
          const status = (error as AxiosError | undefined)?.response?.status
          if (status === 401 || status === 403) {
            clearLoginState(true)
            if (banDevtoolEnable) {
              devtoolForbidden()
            }
            return
          }

          if (!retried) {
            window.setTimeout(() => {
              apiClient.owner
                .getSession()
                .then(applySession)
                .catch((retryError) => handleSessionError(retryError, true))
            }, 600)
            return
          }

          clearLoginState()
          if (banDevtoolEnable) {
            devtoolForbidden()
          }
          console.warn('Session check skipped due to temporary error:', error)
        }

        apiClient.owner.getSession().then(applySession).catch(handleSessionError)
      })
    },
  }
}
