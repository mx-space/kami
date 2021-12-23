/*
 * @Author: Innei
 * @Date: 2020-09-30 16:57:04
 * @LastEditTime: 2021-05-29 18:26:36
 * @LastEditors: Innei
 * @FilePath: /web/pages/login/index.tsx
 * @Mark: Coding with Love
 */
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Input } from 'components/Input'
import { NextPage } from 'next'
import Router from 'next/router'
import { useState } from 'react'
import { releaseDevtool } from 'utils/console'
import { message } from 'utils/message'
import { useStore } from '../../common/store'
import { Rest } from '../../utils/api'
import { setToken } from '../../utils/cookie'
// import { releaseDevtools } from 'utils/console'
import styles from './index.module.css'

const LoginView: NextPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { userStore } = useStore()
  const handleLogin = async () => {
    const data = (await Rest('Master', 'login').post({
      username,
      password,
    })) as any
    setToken(data.token, 7)
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
            prefix={<FontAwesomeIcon icon={faUser} />}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles['field']}>
          <Input
            prefix={<FontAwesomeIcon icon={faLock} />}
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
