import { FC } from 'react'
import { Avatar } from '../../Avatar'
import style from './index.module.scss'
import Markdown from 'components/MD-render'

import { relativeTimeFromNow } from '../../../utils/time'
export const Message: FC = (props) => {
  const time = new Date('2020-05-24 19:52:59')
  return (
    <div className={style['message']}>
      <Avatar
        size={35}
        imageUrl={
          'https://tu-1252943311.cos.ap-shanghai.myqcloud.com/innei_avatar.png/avatar300'
        }
      />
      <div className={style['message-wrapper']}>
        <div className={style['message-head']}>
          <div className={style['author-name']}>Innei</div>
          <time>{relativeTimeFromNow(time)}</time>
        </div>
        <div className={style['message-content']}>
          <Markdown
            style={{ fontSize: '12px' }}
            skipHtml
            disallowedTypes={[
              'heading',
              'imageReference',
              'listItem',
              'list',
              'table',
              'tableBody',
              'tableHead',
              'tableCell',
              'tableRow',
            ]}
            unwrapDisallowed
            value={`还在打理中哦 ψ(｀∇´)ψ`}
          />
        </div>
      </div>
    </div>
  )
}
