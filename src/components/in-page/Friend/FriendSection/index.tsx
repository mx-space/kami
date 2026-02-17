import type { FC } from 'react'
import { useCallback, useMemo, useState } from 'react'

import type { LinkModel } from '@mx-space/api-client'

import { Avatar } from '~/components/ui/Avatar'
import { BottomToUpTransitionView } from '~/components/ui/Transition/BottomToUpTransitionView'

import styles from './index.module.css'

export type FriendSectionProps = {
  data: LinkModel[]
}

export const FavoriteSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul>
      {data.map((link) => {
        return (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.name}
            </a>
            <span className="meta">{link.description || ''}</span>
          </li>
        )
      })}
    </ul>
  )
}

export const OutdateSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul>
      {data.map((link) => {
        return (
          <li key={link.id}>
            <a className="cursor-not-allowed">{link.name}</a>
            <span className="meta">{link.description || ''}</span>
          </li>
        )
      })}
    </ul>
  )
}

export const BannedSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul>
      {data.map((link) => {
        return (
          <li key={link.id}>
            <span className="cursor-not-allowed">{link.name}</span>
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
    <div className="<sm:grid-cols-1 grid grid-cols-2 gap-6">
      {data.map((link, i) => {
        return (
          <BottomToUpTransitionView key={link.id} timeout={{ enter: 50 * i }}>
            <Card link={link} />
          </BottomToUpTransitionView>
        )
      })}
    </div>
  )
}

const Card: FC<{ link: LinkModel }> = ({ link }) => {
  const [focused, setFocus] = useState(false)

  return (
    <a
      href={link.url}
      target="_blank"
      className={styles['card']}
      onMouseEnter={useCallback(() => {
        setFocus(true)
      }, [])}
      onMouseLeave={useCallback(() => {
        setFocus(false)
      }, [])} rel="noreferrer"
    >
      <CircleAvatar focus={focused} size={80} src={link.avatar} />
      <span className="flex h-full flex-col justify-start space-y-2 py-3">
        <span className="text-lg">{link.name}</span>
        <span className="text-deepgray line-clamp-2 break-all text-sm">
          {link.description}
        </span>
      </span>
    </a>
  )
}

const CircleAvatar: FC<{ focus: boolean; src: string; size: number }> = (
  props,
) => {
  const { size, src, focus } = props
  const C = useMemo(() => size * Math.PI, [size])
  return (
    <span className="relative inline-block">
      <Avatar imageUrl={src} wrapperProps={friendAvatarWrapperProps} />
      <span className={styles['border']}>
        <svg>
          <circle
            cx={size >> 1}
            cy={size >> 1}
            r={size >> 1}
            style={{
              strokeDasharray: `${C}px`,
              strokeDashoffset: !focus ? `${C}px` : '0',
            }}
          />
        </svg>
      </span>
    </span>
  )
}
