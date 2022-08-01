import shuffle from 'lodash-es/shuffle'
import type { FC } from 'react'
import { memo, useEffect, useState } from 'react'

import type { LinkModel } from '@mx-space/api-client'
import { LinkState, LinkType } from '@mx-space/api-client'

import { apiClient } from '~/utils/client'

import { Avatar } from '../../../universal/Avatar'
import styles from './index.module.css'

export const FriendItem: FC<LinkModel> = memo((props) => {
  return (
    <div className={styles['avatar-item']}>
      <Avatar imageUrl={props.avatar} alt={props.name} url={props.url} />
      <span className={styles['avatar-name']}>{props.name}</span>
    </div>
  )
})

export const FriendsSection: FC = memo(() => {
  const [friends, setFriends] = useState<LinkModel[]>([])
  useEffect(() => {
    apiClient.link.getAll().then((res) => {
      const data = res.data as LinkModel[]
      setFriends(
        shuffle(
          data.filter(
            (i) =>
              i.type === LinkType.Friend &&
              i.state === LinkState.Pass &&
              !i.hide,
          ),
        ).slice(0, 20),
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
