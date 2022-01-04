import { LikeButton } from 'components/LikeButton'
import { useRouter } from 'next/router'
import React, { FC, memo, useEffect, useState } from 'react'
import { eventBus, isLikedBefore, setLikeId } from 'utils'
import { apiClient } from 'utils/client'
import { message } from 'utils/message'
import styles from './index.module.css'
export const HeaderActionButton: FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  return (
    <div
      className="flex items-center rounded-full px-3 bg-shallow cursor-pointer"
      {...props}
    ></div>
  )
}
export const HeaderActionButtonsContainer = memo((props) => {
  return <div className="mr-3 flex items-center">{props.children}</div>
})

export const HeaderActionLikeButtonForNote: FC<{ id: number }> = memo(
  (props) => {
    const { id } = props
    const [liked, setLiked] = useState(false)
    const router = useRouter()
    useEffect(() => {
      setLiked(false)
    }, [router])
    useEffect(() => {
      setLiked(isLikedBefore(id.toString()))

      const handler = (nid) => {
        if (id === nid) {
          setLiked(true)
        }
      }
      eventBus.on('like', handler)

      return () => {
        eventBus.off('like', handler)
      }
    }, [id])
    const onLike = () =>
      apiClient.note
        .likeIt(id)
        .then(() => {
          message.success('感谢喜欢!')
          eventBus.emit('like', id)
          setLikeId(id.toString())
        })
        .catch(() => {
          setLiked(true)
        })

    return (
      <div onClick={onLike} className="flex items-center">
        <div className={styles['like-button']}>
          <LikeButton checked={liked} />
        </div>

        <span className="flex-shrink-0">喜欢</span>
      </div>
    )
  },
)
