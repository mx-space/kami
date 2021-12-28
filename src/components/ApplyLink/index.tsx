import {
  faEnvelope,
  faUser,
  faUserCircle,
} from '@fortawesome/free-regular-svg-icons'
import { faGlobeAsia, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { apiClient } from 'utils/client'
import { message } from 'utils/message'
import isEmail from 'validator/lib/isEmail'
import isURL from 'validator/lib/isURL'
import { Input } from '../Input'
import styles from './index.module.css'

type Field = `friend-${'author' | 'avatar' | 'desc' | 'email' | 'url' | 'name'}`

export const ApplyForLink: FC = () => {
  const {
    register,
    handleSubmit: submitHook,
    reset,
  } = useForm({
    shouldFocusError: true,
  })
  const handleSubmit = submitHook(
    (d: Record<Field, string>) => {
      apiClient.friend.proxy.audit
        .post({
          params: {
            author: d['friend-author'],
          },
          data: {
            author: d['friend-author'],
            url: d['friend-url'],
            avatar: d['friend-avatar'],
            description: d['friend-desc'],
            email: d['friend-email'],
            name: d['friend-name'],
          },
        })

        .then(() => {
          message.success('感谢你能和我交朋友~')
          message.success('待主人查看之后将会通知您哦')
        })
    },
    (err) => {
      console.log(err)

      const firstError = Object.entries(err)
      const [name, value] = firstError[0]

      message.error(`${name}: ${value.message}`)
    },
  )

  const handleReset = useCallback(() => {
    reset({})
  }, [])
  return (
    <article className={styles.wrap}>
      <h1>我想和你交朋友！</h1>
      <form action="#" onSubmit={handleSubmit}>
        <Input
          placeholder={'昵称 *'}
          required
          prefix={<FontAwesomeIcon icon={faUser} />}
          {...register('friend-author', {
            maxLength: { value: 20, message: '乃的名字太长了!' },
            required: { value: true, message: '输入你的大名吧' },
          })}
        />
        <Input
          placeholder={'站点标题 *'}
          required
          prefix={<FontAwesomeIcon icon={faPen} />}
          {...register('friend-name', {
            maxLength: { value: 20, message: '标题太长了 www' },
            required: { value: true, message: '标题是必须的啦' },
          })}
        />
        <Input
          placeholder={'网站 * https://'}
          required
          prefix={<FontAwesomeIcon icon={faGlobeAsia} />}
          {...register('friend-url', {
            validate: (value) => isURL(value, { require_protocol: true }),
            required: true,
          })}
        />
        <Input
          placeholder={'头像链接 * https://'}
          required
          prefix={<FontAwesomeIcon icon={faUserCircle} />}
          {...register('friend-avatar', {
            validate: (value) => isURL(value, { require_protocol: true }),
            required: true,
          })}
        />
        <Input
          placeholder={'留下你的邮箱哦 *'}
          required
          prefix={<FontAwesomeIcon icon={faEnvelope} />}
          {...register('friend-email', {
            validate: (value) => isEmail(value),
            required: { message: '邮箱不能为空哦', value: true },
          })}
        />
        <Input
          multi
          maxLength={50}
          placeholder={'描述 *'}
          required
          {...register('friend-desc', {
            maxLength: { message: '最大长度 50 !', value: 50 },
            required: { message: '描述信息不能为空哦', value: true },
          })}
        />
      </form>
      <div style={{ textAlign: 'right', marginTop: '5px' }}>
        <button
          className="btn red"
          onClick={handleReset}
          type="reset"
          style={{ marginRight: '12px' }}
        >
          重置
        </button>
        <button type="submit" className="btn yellow" onClick={handleSubmit}>
          发送
        </button>
      </div>
    </article>
  )
}
