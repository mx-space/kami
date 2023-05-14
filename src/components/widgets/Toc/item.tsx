import { clsx } from 'clsx'
import type { FC, RefObject } from 'react'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'

import { springScrollToElement } from '~/utils/spring'

import styles from './index.module.css'

export const TocItem: FC<{
  title: string
  depth: number
  active: boolean
  rootDepth: number
  onClick: (i: number) => void
  index: number
  containerRef?: RefObject<HTMLDivElement>
}> = memo((props) => {
  const { index, active, depth, title, rootDepth, onClick, containerRef } =
    props
  const $ref = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (active) {
      const state = history.state
      history.replaceState(state, '', `#${title}`)
    }
  }, [active, title])

  useEffect(() => {
    if (!$ref.current || !active || !containerRef?.current) {
      return
    }
    // NOTE animation group will wrap a element as a scroller container
    const $scoller = containerRef.current.children?.item(0)

    if (!$scoller) {
      return
    }
    const itemHeight = $ref.current.offsetHeight
    const currentScrollerTop = $scoller.scrollTop
    const scollerContainerHeight = $scoller.clientHeight
    const thisItemTop = index * itemHeight

    if (
      currentScrollerTop - thisItemTop >= 0 ||
      (thisItemTop >= currentScrollerTop &&
        thisItemTop >= scollerContainerHeight)
    ) {
      $scoller.scrollTop = thisItemTop
    }
  }, [active, containerRef, index])

  const renderDepth = useMemo(() => {
    const result = depth - rootDepth

    return result
  }, [depth, rootDepth])
  return (
    <a
      ref={$ref}
      data-index={index}
      href={`#${title}`}
      className={clsx(styles['toc-link'], active && styles['active'])}
      style={useMemo(
        () => ({
          paddingLeft:
            depth >= rootDepth ? `${1.2 + renderDepth * 0.6}rem` : undefined,
        }),
        [depth, renderDepth, rootDepth],
      )}
      data-depth={depth}
      onClick={useCallback(
        (e) => {
          e.preventDefault()
          onClick(index)
          const $el = document.getElementById(title)
          if ($el) {
            springScrollToElement($el, -100)
          }
        },
        [index, title, onClick],
      )}
      title={title}
    >
      <span className={styles['a-pointer']}>{title}</span>
    </a>
  )
})
