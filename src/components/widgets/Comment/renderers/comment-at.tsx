import { observer } from 'mobx-react-lite'
import type { FC, MouseEventHandler } from 'react'
import { useCallback } from 'react'
import { useStore } from 'store'

import { getCommentWrap } from '../helper'

export const CommentAtRender: FC<{ text: string }> = observer(({ text }) => {
  const { commentStore } = useStore()
  const { commentIdMap } = commentStore
  const comment = typeof text === 'string' ? commentIdMap.get(text) : text

  const onMouseOver: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      e.stopPropagation()
      const $parent = getCommentWrap(comment!)

      if (!$parent) {
        return
      }
      // $parent.classList.add('highlight')
      $parent.getAnimations?.().forEach((i) => i.cancel())
      const animate = $parent.animate(
        [
          {
            backgroundColor: 'transparent',
          },
          {
            backgroundColor: '#FFEBC9ee',
          },
        ],
        {
          duration: 1000,
          iterations: Infinity,
          direction: 'alternate',
          easing: 'linear',
          fill: 'both',
        },
      )

      if (typeof $parent.getAnimations === 'undefined') {
        $parent.getAnimations = () => {
          return [animate]
        }
      }
    },
    [comment],
  )

  const onClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    const $parent = getCommentWrap(comment!)
    if (!$parent) {
      return
    }
    $parent.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    $parent.animate([
      {
        backgroundColor: '#FFEBC9',
      },
      {
        backgroundColor: 'transparent',
      },
    ])
  }
  const onLeave: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      e.stopPropagation()
      const $parent = getCommentWrap(comment!)

      if (!$parent) {
        return
      }
      // $parent.classList.add('highlight')
      // support only Chrome >= 79 (behind the Experimental Web Platform Features preference)
      $parent.getAnimations?.().forEach((a) => a.cancel())
    },
    [comment],
  )

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
