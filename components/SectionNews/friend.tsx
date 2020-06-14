import defaultAvatar from 'assets/images/default-avatar.png'
import { FC, useEffect, useState, memo } from 'react'
import { LinkModel, LinkType } from '../../models/link'
import { Rest } from '../../utils/api'
import { Avatar } from '../Avatar'
import styles from './index.module.scss'
export const FriendItem: FC<LinkModel> = memo((props) => {
  return (
    <a className={styles['avatar-item']} href={props.url} target={'_blank'}>
      <Avatar
        {...{
          imageUrl: props.avatar || defaultAvatar,
          alt: props.name,
          url: props.url,
        }}
      />
      <span className={styles['avatar-name']}>{props.name}</span>
    </a>
  )
})

export const FriendsSection: FC = memo(() => {
  const [friends, setFriends] = useState<LinkModel[]>([])
  useEffect(() => {
    Rest('Link')
      .gets({ page: 1, size: 20 })
      .then((res: any) => {
        const data = res.data as LinkModel[]
        setFriends(data.filter((i) => i.type === LinkType.Friend))
      })
  }, [])
  return (
    <div className={styles['friends']}>
      {friends.map((item) => {
        return <FriendItem {...item} key={item._id} />
      })}
    </div>
  )
})
