import { FC, useState, useEffect } from 'react'
import { Avatar } from '../Avatar'
import styles from './index.module.scss'
import { Rest } from '../../utils/api'
import { LinkModel, LinkType } from '../../models/dto/link'
import defaultAvatar from 'assets/images/default-avatar.png'
export const FriendItem: FC<LinkModel> = (props) => {
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
}

export const FriendsSection: FC = () => {
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
}
