import { FC, memo } from 'react'
import { copy } from '../../utils/dom'
import styles from './index.module.scss'

export interface CopyrightProps {
  title: string
  link: string
  date: string
}

export const Copyright: FC<CopyrightProps> = memo((props) => {
  const { title, link, date } = props

  return (
    <section className={styles['copyright-session']}>
      <p>文章标题: {title}</p>
      <p>
        文章链接: <span>{link}</span>{' '}
        <a
          onClick={() => {
            copy(link)
          }}
        >
          [复制]
        </a>
      </p>
      <p>最后修改时间: {date}</p>
      <hr />
      <div>
        <p>
          商业转载请联系站长获得授权，非商业转载请注明本文出处及文章链接，未经站长允许不得对文章文字内容进行修改演绎。
          <br />
          本文采用
          <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">
            创作共用保留署名-非商业-禁止演绎4.0国际许可证
          </a>
        </p>
      </div>
    </section>
  )
})
