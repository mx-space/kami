import { LinkModel } from '@mx-space/api-client'
import { Avatar } from 'components/universal/Avatar'
import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import { FC } from 'react'
import { TransitionGroup } from 'react-transition-group'
import styles from './section.module.css'

export type FriendSectionProps = {
  data: LinkModel[]
}
export const FavoriteSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul>
      {data.map((link) => {
        return (
          <li key={link.id}>
            <a href={link.url} target={'_blank'}>
              {link.name}
            </a>
            <span className="meta">{link.description || ''}</span>
          </li>
        )
      })}
    </ul>
  )
}

const friendAvatarWrapperProps = {
  className: 'flex-shrink-0 !border-0 bg-light-bg avatar',
}
export const FriendSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <TransitionGroup>
      <div className="grid <sm:grid-cols-1 grid-cols-2 gap-6">
        {data.map((link, i) => {
          return (
            <BottomUpTransitionView key={link.id} timeout={{ enter: 100 * i }}>
              <a href={link.url} target={'_blank'} className={styles['card']}>
                <Avatar
                  imageUrl={link.avatar}
                  wrapperProps={friendAvatarWrapperProps}
                ></Avatar>
                <span className="flex flex-col justify-start space-y-2 h-full py-3">
                  <span className="text-lg">{link.name}</span>
                  <span className="text-deepgray text-sm">
                    {link.description}
                  </span>
                </span>
              </a>
            </BottomUpTransitionView>
          )
        })}
      </div>
    </TransitionGroup>
  )
}
