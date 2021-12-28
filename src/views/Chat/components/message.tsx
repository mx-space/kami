/*
 * @Author: Innei
 * @Date: 2020-09-17 14:02:24
 * @LastEditTime: 2021-02-24 20:36:52
 * @LastEditors: Innei
 * @FilePath: /web/components/Chat/components/message.tsx
 * @Mark: Coding with Love
 */
import { RelativeTime } from 'components/RelativeTime'
import { FC } from 'react'
import { observer } from 'utils/mobx'
import Markdown from 'views/Markdown'
import { useStore } from '../../../common/store'
import { Avatar } from '../../../components/Avatar'
import style from './index.module.css'

export const OwnerMessage: FC<{ text: string; date: Date }> = observer(
  ({ text, date }) => {
    const { userStore } = useStore()
    return (
      <div className={style['message']}>
        <Avatar size={35} imageUrl={userStore.master.avatar as string} />
        <div className={style['message-wrapper']}>
          <div className={style['message-head']}>
            <div className={style['author-name']}>{userStore.name}</div>
            <time>
              <RelativeTime date={date} />
            </time>
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
