import { NextPage } from 'next'
import { useState } from 'react'
import { Rest } from '../../utils/api'
import { setToken } from '../../utils/auth'
import Router from 'next/router'
import { Input, message } from 'antd'
import { useStore } from '../../common/store'

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
    Router.push('/')
    message.success('登陆成功')
    userStore.setToken(data.token)
    userStore.setLogged(true)
  }

  return (
    <main>
      <style jsx>{`
        .login-wrap {
          position: absolute;

          top: 35%;
          left: 0;
          right: 0;
          text-align: center;
          transfrom: translateY(-50%);
        }
        .field {
          margin: 24px 0;
        }
      `}</style>
      <div className="login-wrap">
        <div className={'field'}>
          <span>用户名：</span>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={'field'}>
          <span>密码：</span>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => (e.keyCode === 13 ? handleLogin() : '')}
          />
        </div>
        <button className="btn blue" onClick={() => handleLogin()}>
          登陆
        </button>
      </div>
    </main>
  )
}

export default LoginView
