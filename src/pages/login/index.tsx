import type { NextPage } from 'next'
import Router from 'next/router'
import { useState } from 'react'
import { message } from 'react-message-popup'

import { useUserStore } from '~/atoms/user'
import { PhUser } from '~/components/ui/Icons/for-comment'
import { CarbonPassword } from '~/components/ui/Icons/for-login'
import { Input } from '~/components/ui/Input'
import { apiClient } from '~/utils/client'
import { releaseDevtool } from '~/utils/console'

import { setToken } from '../../utils/cookie'
import styles from './index.module.css'

const LoginView: NextPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const data = await apiClient.user.login(username, password)

    setToken(data.token)
    if (history.backPath && history.backPath.length) {
      Router.push(history.backPath.pop()!)
    } else {
      Router.push('/')
    }
    message.success('登录成功')

    useUserStore.getState().setToken(data.token)
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
          登录
        </button>
      </div>
    </main>
  )
}

export default LoginView
