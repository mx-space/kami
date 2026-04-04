import type { NextPage } from 'next'
import type { UserModel } from '@mx-space/api-client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { message } from 'react-message-popup'

import { useUserStore } from '~/atoms/user'
import { useRouter } from '~/i18n/navigation'
import { PhUser } from '~/components/ui/Icons/for-comment'
import { CarbonPassword } from '~/components/ui/Icons/for-login'
import { Input } from '~/components/ui/Input'
import { apiClient } from '~/utils/client'
import { releaseDevtool } from '~/utils/console'
import { setToken } from '~/utils/cookie'

import styles from './index.module.css'

/** v2 sign-in returns `{ token, user }`; some gateways may nest under `data`. */
function tokenFromSignIn(res: { token?: string; data?: { token?: string } }) {
  if (res?.token) return res.token
  const inner = res?.data
  if (inner && typeof inner.token === 'string') return inner.token
  return undefined
}

const LoginView: NextPage = () => {
  const t = useTranslations('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const res = await apiClient.owner.login(username, password, {
      rememberMe: true,
    })
    const token = tokenFromSignIn(res as { token?: string; data?: { token?: string } })
    if (!token) {
      message.error(t('fail'))
      return
    }

    setToken(token)
    if (history.backPath && history.backPath.length) {
      router.push(history.backPath.pop()!)
    } else {
      router.push('/')
    }
    message.success(t('success'))

    useUserStore.getState().setToken(token)
    try {
      const owner = await apiClient.owner.getOwnerInfo()
      useUserStore.getState().setUser(owner as UserModel)
    } catch {
      /* profile fetch is best-effort */
    }
    releaseDevtool()
  }

  return (
    <main>
      <div className={styles['login-wrap']}>
        <div className={styles['field']}>
          <Input
            prefix={<PhUser />}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles['field']}>
          <Input
            prefix={<CarbonPassword />}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => (e.keyCode === 13 ? handleLogin() : '')}
          />
        </div>

        <button className="btn blue" onClick={() => handleLogin()}>
          {t('title')}
        </button>
      </div>
    </main>
  )
}

export default LoginView
