import { observer } from 'mobx-react-lite'
import type { FC, MouseEventHandler } from 'react'
import { useCallback } from 'react'

import { useStore } from '~/store'
import { springScrollToElement } from '~/utils/spring'

export const CommentAtRender: FC<{ id: string }> = observer(({ id: value }) => {
  const { commentStore } = useStore()
  const { commentIdMap } = commentStore
  const comment = typeof value === 'string' ? commentIdMap.get(value) : value

  const onMouseOver: MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    if (comment?.id) {
      commentStore.setHighlightCommnet(comment.id)
    }
  }, [comment?.id])

  const onClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()

    const $el = document.getElementById(`comments-${comment?.id}`)

    $el && springScrollToElement($el, 1000, -120)
  }
  const onLeave: MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    if (comment?.id) {
      commentStore.setHighlightCommnet(comment.id, false)
    }
  }, [comment?.id])

  if (!comment) {
    return null
  }
  return (
    <a
      href={'javascript:;'}
      className={'mr-[12px] text-primary'}
      onMouseOver={onMouseOver}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      @{comment.author}
    </a>
  )
})
