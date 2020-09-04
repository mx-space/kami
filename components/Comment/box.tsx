import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons'
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { message } from 'antd'
import omit from 'lodash/omit'
import React, { FC, memo, useEffect, useState } from 'react'
import isEmail from 'validator/lib/isEmail'
import isUrl from 'validator/lib/isURL'
import { useStore } from '../../common/store'
import { Input } from '../Input'
import styles from './index.module.scss'

const USER_PREFIX = 'mx-space-comment-author'

const CommentBox: FC<{
  onSubmit: ({ text, author, mail, url }) => any
  onCancel?: () => any
}> = memo(({ onSubmit, onCancel }) => {
  const [author, setAuthor] = useState('')
  const [mail, setMail] = useState('')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')

  const { userStore } = useStore()
  const logged = userStore.isLogged
  const reset = () => {
    // setAuthor('')
    // setMail('')
    setText('')
    // setUrl('')
  }

  const handleCancel = () => {
    onCancel?.()
    reset()
  }
  const handleSubmit = () => {
    if (!logged) {
      if (author === userStore.name || author === userStore.username) {
        return message.error('昵称与我主人重名了, 但是你好像并不是我的主人唉')
      }
      if (!author || !text || !mail) {
        message.error('亲亲, 能把信息填完整么')
        return
      }
      if (url && !isUrl(url, { require_protocol: true })) {
        message.error('亲亲, 网址格式不正确哦')
        return
      }
      if (!isEmail(mail)) {
        message.error('亲亲, 邮箱格式不正确哦')
        return
      }
      if (author.length > 20) {
        message.error('昵称太长了了啦, 服务器会坏掉的')
        return
      }
    }

    if (text.length > 500) {
      message.error('内容太长了了啦, 服务器会坏掉的')
      return
    }
    const model = {
      author: author,
      text: text,
      mail: mail,
      url: url || undefined,
    }
    localStorage.setItem(USER_PREFIX, JSON.stringify(omit(model, ['text'])))
    onSubmit(model).then(() => {
      reset()
    })
  }
  useEffect(() => {
    const store = localStorage.getItem(USER_PREFIX)
    if (store) {
      try {
        const model = JSON.parse(store) as {
          author: string
          mail: string
          url: string
        }
        setMail(model.mail || '')
        setAuthor(model.author || '')
        setUrl(model.url || '')
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }, [])
  return (
    <div>
      {!logged && (
        <div className={styles['comment-box-head']}>
          <Input
            placeholder={'昵称 *'}
            required
            name={'author'}
            prefix={<FontAwesomeIcon icon={faUser} />}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Input
            placeholder={'邮箱 *'}
            name={'mail'}
            required
            prefix={<FontAwesomeIcon icon={faEnvelope} />}
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
          <Input
            placeholder={'网站 https?://'}
            name={'website'}
            prefix={<FontAwesomeIcon icon={faGlobeAsia} />}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}
      <Input
        multi
        maxLength={500}
        // @ts-ignore
        rows={4}
        required
        placeholder={
          !logged ? '亲亲, 留个评论好不好嘛~' : '主人, 说点什么好呢? '
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <style jsx>{`
        button {
          margin-left: 12px;
        }
      `}</style>
      <div style={{ textAlign: 'right', marginTop: '5px' }}>
        {onCancel && (
          <button className="btn red" onClick={handleCancel}>
            取消回复
          </button>
        )}
        <button
          className="btn yellow"
          onClick={handleSubmit}
          disabled={text.trim().length === 0}
        >
          发送
        </button>
      </div>
    </div>
  )
})

export default CommentBox
