import { GlobalOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Input, message } from 'antd'
import { FC, useState } from 'react'
import styles from './index.module.scss'
import isEmail from 'validator/lib/isEmail'
import isUrl from 'validator/lib/isURL'

const { TextArea } = Input

const CommentBox: FC<{
  onSubmit: ({ text, author, mail, url }) => any
  onCancel?: () => any
}> = ({ onSubmit, onCancel }) => {
  const [author, setAuthor] = useState('')
  const [mail, setMail] = useState('')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
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
    if (text.length > 200) {
      message.error('内容太长了了啦, 服务器会坏掉的')
      return
    }
    onSubmit({
      author: author,
      text: text,
      mail: mail,
      url: url || undefined,
    })
    reset()
  }

  return (
    <>
      <div className={styles['comment-box-head']}>
        <Input
          placeholder={'昵称 *'}
          required
          name={'author'}
          prefix={<UserOutlined className="site-form-item-icon" />}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Input
          placeholder={'邮箱 *'}
          name={'mail'}
          required
          prefix={<MailOutlined className="site-form-item-icon" />}
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />
        <Input
          placeholder={'网站 https?://'}
          name={'website'}
          prefix={<GlobalOutlined className="site-form-item-icon" />}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <TextArea
        rows={4}
        required
        placeholder={'亲亲, 留个评论好不好嘛~'}
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
        <button className="btn yellow" onClick={handleSubmit}>
          发送
        </button>
      </div>
    </>
  )
}

export default CommentBox
