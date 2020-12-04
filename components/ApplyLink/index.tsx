import { faUser, faUserCircle } from '@fortawesome/free-regular-svg-icons'
import { faGlobeAsia, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { message } from 'utils/message'
import { FC, useCallback, useState } from 'react'
import isURL from 'validator/lib/isURL'
import { Rest } from '../../utils'
import { Input } from '../Input'
import styles from './index.module.scss'

declare type LinkDto = {
  name: string
  url: string
  avatar?: string
  description?: string
}

const buildSchema = ({ site, avatar, description, title }: any): LinkDto => {
  const validate = (() => {
    if (
      !(
        title.trim() &&
        isURL(site, { require_protocol: true }) &&
        isURL(avatar, { require_protocol: true })
      ) ||
      description.trim().length > 50
    ) {
      return false
    }
    return true
  })()
  if (!validate) {
    message.error('输入有误')
    throw new TypeError(
      '输入有误' + JSON.stringify({ site, avatar, description }),
    )
  }
  return { name: title, url: site, avatar, description }
}
const ApplyForLink: FC = () => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [site, setSite] = useState('')
  const [avatar, setAvatar] = useState('')
  const [description, setDesc] = useState('')
  const handleSubmit = () => {
    Rest('Link', `audit?author=${author}`)
      .post(buildSchema({ author, site, avatar, description, title }))
      .then(() => {
        message.success('感谢你能和我交朋友~')
      })
  }

  const handleReset = useCallback(() => {
    ;[setAuthor, setSite, setAvatar, setDesc, setTitle].forEach((s) => s(''))
  }, [])
  return (
    <article className={styles.wrap}>
      <h1>我想和你交朋友!</h1>
      <form action="#">
        <Input
          placeholder={'昵称 *'}
          required
          name={'friend-author'}
          prefix={<FontAwesomeIcon icon={faUser} />}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Input
          placeholder={'站点标题 *'}
          required
          name={'friend-title'}
          prefix={<FontAwesomeIcon icon={faPen} />}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder={'网站 *'}
          required
          name={'friend-website'}
          prefix={<FontAwesomeIcon icon={faGlobeAsia} />}
          value={site}
          onChange={(e) => {
            setSite(e.target.value)
          }}
        />
        <Input
          placeholder={'头像链接 *'}
          required
          name={'friend-avatar'}
          prefix={<FontAwesomeIcon icon={faUserCircle} />}
          value={avatar}
          onChange={(e) => {
            setAvatar(e.target.value)
          }}
        />
        <Input
          multi
          maxLength={50}
          placeholder={'描述'}
          name={'friend-desc'}
          value={description}
          onChange={(e) => {
            setDesc(e.target.value)
          }}
        />
      </form>
      <div style={{ textAlign: 'right', marginTop: '5px' }}>
        <button
          className="btn red"
          onClick={handleReset}
          style={{ marginRight: '12px' }}
        >
          重置
        </button>
        <button className="btn yellow" onClick={handleSubmit}>
          发送
        </button>
      </div>
    </article>
  )
}

export { ApplyForLink }
