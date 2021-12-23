/*
 * @Author: Innei
 * @Date: 2020-12-22 20:17:50
 * @LastEditTime: 2021-06-27 16:16:18
 * @LastEditors: Innei
 * @FilePath: /web/components/SectionNews/friend.tsx
 * @Mark: Coding with Love
 */
import defaultAvatar from 'assets/images/default-avatar.png'
import { FC, memo, useEffect, useState } from 'react'
import { LinkModel, LinkState, LinkType } from '../../models/link'
import { Rest } from '../../utils/api'
import { Avatar } from '../Avatar'
import styles from './index.module.scss'
export const FriendItem: FC<LinkModel> = memo((props) => {
  return (
    <div className={styles['avatar-item']}>
      <Avatar
        imageUrl={props.avatar || defaultAvatar.src}
        alt={props.name}
        url={props.url}
      />
      <span className={styles['avatar-name']}>{props.name}</span>
    </div>
  )
})

export const FriendsSection: FC = memo(() => {
  const [friends, setFriends] = useState<LinkModel[]>([])
  useEffect(() => {
    Rest('Link')
      .gets({ page: 1, size: 20 })
      .then((res: any) => {
        const data = res.data as LinkModel[]
        setFriends(
          data.filter(
            (i) =>
              i.type === LinkType.Friend &&
              (i.state !== LinkState.Audit || !i.hide),
          ),
        )
      })
  }, [])
  return (
    <div className={styles['friends-wrap']}>
      {friends.map((item) => {
        return <FriendItem {...item} key={item.id} />
      })}
    </div>
  )
})
