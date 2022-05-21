import clsx from 'clsx'
import { LikeButton } from 'components/universal/LikeButton'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { memo } from 'react'
import { useStore } from 'store'

import styles from './index.module.css'

export const HeaderActionButton: FC<JSX.IntrinsicElements['button']> = (
  props,
) => {
  const { className, ...rest } = props
  return (
    <button
      className={clsx(
        'flex items-center justify-center rounded-full px-3 bg-shallow cursor-pointer h-10',
        className,
      )}
      {...rest}
    ></button>
  )
}
export const HeaderActionButtonsContainer = memo((props) => {
  return <div className="mr-3 flex items-center">{props.children}</div>
})

export const HeaderActionLikeButtonForNote: FC<{ id: number }> = observer(
  (props) => {
    const { id } = props
    const { noteStore } = useStore()
    const liked = noteStore.isLiked(id)

    const onLike = () => noteStore.like(id)

    return (
      <HeaderActionButton>
        <div onClick={onLike} className="flex items-center justify-center">
          <div className={styles['like-button']}>
            <LikeButton checked={liked} />
          </div>

          <span className="flex-shrink-0">喜欢</span>
        </div>
      </HeaderActionButton>
    )
  },
)
