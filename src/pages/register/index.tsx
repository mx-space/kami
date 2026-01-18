import type { NextPage } from 'next'
import Router from 'next/router'
import { useState } from 'react'
import { message } from 'react-message-popup'

import { PhUser } from '~/components/ui/Icons/for-comment'
import { CarbonPassword } from '~/components/ui/Icons/for-login'
import { Input } from '~/components/ui/Input'
import { apiClient } from '~/utils/client'

import styles from './index.module.css'

const RegisterView: NextPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mail, setMail] = useState('')

  const handleRegister = async () => {
    if (!username || !password || !name || !mail) {
      message.error('请填写完整信息')
      return
    }

    try {
      await apiClient.proxy.master.register.post({
        username,
        password,
        name,
        mail,
      })
      message.success('注册成功，请登录')
      Router.push('/login')
    } catch {
      return
    }
  }

  return (
    <main>
      <div className={styles['login-wrap']}>
        <h2 className="mb-4 text-xl font-medium text-shizuku-text">注册管理员</h2>
        
        <div className={styles['field']}>
          <Input
            prefix={<PhUser />}
            placeholder="用户名"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className={styles['field']}>
          <Input
            prefix={<PhUser />}
            placeholder="显示昵称"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles['field']}>
          <Input
            prefix={<span className="text-lg">@</span>} 
            placeholder="邮箱"
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </div>

        <div className={styles['field']}>
          <Input
            prefix={<CarbonPassword />}
            placeholder="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => (e.keyCode === 13 ? handleRegister() : '')}
          />
        </div>

        <div className={styles['actions']}>
          <span 
            className={styles['link']} 
            onClick={() => Router.push('/login')}
          >
            已有账号？去登录
          </span>
          <button className="btn blue" onClick={() => handleRegister()}>
            注册
          </button>
        </div>
      </div>
    </main>
  )
}

export default RegisterView
