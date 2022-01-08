import { LinkModel, LinkState, LinkType } from '@mx-space/api-client'
import defaultAvatar from 'assets/images/default-avatar.png'
import { FC, memo, useEffect, useState } from 'react'
import { apiClient } from 'utils/client'
import { Avatar } from '../../universal/Avatar'
import styles from './index.module.css'
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
    apiClient.link.getAllPaginated(1, 20).then((res) => {
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
