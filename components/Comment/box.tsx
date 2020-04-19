import { GlobalOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { FC, useState } from 'react'
import styles from './index.module.scss'

const { TextArea } = Input

const CommentBox: FC<{ onSubmit: ({ text, author, mail, url }) => any }> = ({
  onSubmit,
}) => {
  const [author, setAuthor] = useState('')
  const [mail, setMail] = useState('')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')

  return (
    <>
      <div className={styles['comment-box-head']}>
        <Input
          placeholder={'昵称 *'}
          required
          prefix={<UserOutlined className="site-form-item-icon" />}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Input
          placeholder={'邮箱 *'}
          required
          prefix={<MailOutlined className="site-form-item-icon" />}
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />
        <Input
          placeholder={'网站'}
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
      <div style={{ textAlign: 'right', marginTop: '5px' }}>
        <button
          className="btn yellow"
          onClick={() =>
            onSubmit({
              author: author || undefined,
              text: text || undefined,
              url: url || undefined,
              mail: mail || undefined,
            })
          }
        >
          发送
        </button>
      </div>
    </>
  )
}

export default CommentBox
