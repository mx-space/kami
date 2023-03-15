import { clsx } from 'clsx'
import type { FC } from 'react'
import { memo, useCallback, useRef } from 'react'

import { useNoteCollection } from '~/atoms/collections/note'
import { LikeButton } from '~/components/universal/LikeButton'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'

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
    />
  )
}
export const HeaderActionButtonsContainer = memo((props) => {
  return <div className="mr-3 flex items-center">{props.children}</div>
})

export const HeaderActionLikeButtonForNote: FC<{ id: number }> = (props) => {
  const { id } = props
  const liked = useNoteCollection((state) => state.isLiked(id))

  const onLike = () => {
    useNoteCollection.getState().like(id)
    trackerLike()
  }
  const { event } = useAnalyze()
  const trackerLikeOnce = useRef(false)

  const trackerLike = useCallback(() => {
    if (!trackerLikeOnce.current) {
      event({
        action: TrackerAction.Interaction,
        label: '顶部喜欢触发',
      })

      trackerLikeOnce.current = true
    }
  }, [])
  return (
    <HeaderActionButton onClick={onLike}>
      <div className="flex items-center justify-center">
        <div className={styles['like-button']}>
          <LikeButton checked={liked} />
        </div>

        <span className="flex-shrink-0">喜欢</span>
      </div>
    </HeaderActionButton>
  )
}
