import { clsx } from 'clsx'
import type { FC } from 'react'
import { memo, useCallback, useEffect, useMemo } from 'react'

import { springScrollToElement } from '~/utils/spring'

import styles from './index.module.css'

export const TocItem: FC<{
  title: string
  depth: number
  active: boolean
  rootDepth: number
  onClick: (i: number) => void
  index: number
}> = memo((props) => {
  const { index, active, depth, title, rootDepth, onClick } = props
  useEffect(() => {
    if (active) {
      const state = history.state
      history.replaceState(state, '', `#${title}`)
    }
  }, [active, title])
  const renderDepth = useMemo(() => {
    const result = depth - rootDepth

    return result
  }, [depth, rootDepth])
  return (
    <a
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
            springScrollToElement($el, undefined, -100)
          }
        },
        [index, title, onClick],
      )}
    >
      <span className={styles['a-pointer']}>{title}</span>
    </a>
  )
})
