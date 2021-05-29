import { useStore } from 'common/store'
import { FC } from 'react'
import { observer } from 'utils/mobx'
import { copy } from '../../utils/dom'
import styles from './index.module.css'

export interface CopyrightProps {
  title: string
  link: string
  date: string
}

export const Copyright: FC<CopyrightProps> = observer((props) => {
  const { title, link, date } = props
  const {
    userStore: { name },
  } = useStore()
  return (
    <section className={styles['copyright-session']} id="copyright">
      <p>文章标题: {title}</p>
      <p>文章作者: {name}</p>
      <p>
        文章链接: <span>{link}</span>{' '}
        <a
          onClick={() => {
            // copy(link)
            navigator.clipboard.writeText(link)
          }}
          data-hide-print
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
