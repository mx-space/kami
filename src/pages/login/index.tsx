import type { NextPage } from 'next'
import Router from 'next/router'
import { useState } from 'react'
import { message } from 'react-message-popup'
import { releaseDevtool } from 'utils'

import { CarbonPassword, PhUser } from '~/components/universal/Icons'
import { Input } from '~/components/universal/Input'
import { apiClient } from '~/utils/client'

import { useStore } from '../../store'
import { setToken } from '../../utils/cookie'
import styles from './index.module.css'

const LoginView: NextPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { userStore } = useStore()
  const handleLogin = async () => {
    const data = await apiClient.user.login(username, password)

    setToken(data.token)
    if (history.backPath && history.backPath.length) {
      Router.push(history.backPath.pop()!)
    } else {
      Router.push('/')
    }
    message.success('登录成功')
    userStore.setToken(data.token)
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
