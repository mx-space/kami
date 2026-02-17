import { clsx } from 'clsx'
import type { FC } from 'react'
import { memo, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'

import { useNoteCollection } from '~/atoms/collections/note'
import { LikeButton } from '~/components/ui/LikeButton'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'

import styles from './index.module.css'

export const HeaderActionButton: FC<JSX.IntrinsicElements['button']> = (
  props,
) => {
  const { className, ...rest } = props
  return (
    <button
      className={clsx(
        'bg-shallow flex h-10 cursor-pointer items-center justify-center rounded-full px-3',
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
  const t = useTranslations('note')
  const tCommon = useTranslations('common')
  const liked = useNoteCollection((state) => state.isLiked(id))

  const onLike = () => {
    useNoteCollection.getState().like(id, {
      alreadyLiked: t('alreadyLiked'),
      thanksLike: t('thanksLike'),
    })
    trackerLike()
  }
  const { event } = useAnalyze()
  const trackerLikeOnce = useRef(false)

  const trackerLike = useCallback(() => {
    if (!trackerLikeOnce.current) {
      event({
        action: TrackerAction.Interaction,
        label: tCommon('trackHeaderLike'),
      })

      trackerLikeOnce.current = true
    }
  }, [event, tCommon])
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
