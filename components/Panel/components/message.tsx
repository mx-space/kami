import { FC } from 'react'
import { Avatar } from '../../Avatar'
import style from './index.module.scss'
import Markdown from 'components/MD-render'

import { relativeTimeFromNow } from '../../../utils/time'
import configs from '../../../configs'
import { useStore } from '../../../store'
import { observer } from 'mobx-react'
export const OwnerMessage: FC<{ text: string; date: Date }> = observer(
  ({ text, date }) => {
    const { userStore } = useStore()
    return (
      <div className={style['message']}>
        <Avatar size={35} imageUrl={configs.avatar} />
        <div className={style['message-wrapper']}>
          <div className={style['message-head']}>
            <div className={style['author-name']}>{userStore.name}</div>
            <time>{relativeTimeFromNow(date)}</time>
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
              value={text}
            />
          </div>
        </div>
      </div>
    )
  },
)
