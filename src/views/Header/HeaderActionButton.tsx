import { noteStore } from 'common/store'
import { LikeButton } from 'components/LikeButton'
import { observer } from 'mobx-react-lite'
import React, { FC, memo } from 'react'
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

export const HeaderActionLikeButtonForNote: FC<{ id: number }> = observer(
  (props) => {
    const { id } = props

    const liked = noteStore.isLiked(id)

    const onLike = () => noteStore.like(id)

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
