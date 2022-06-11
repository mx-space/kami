import clsx from 'clsx'
import type { FC } from 'react'
import { memo, useEffect, useMemo } from 'react'

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

    return result == 0 ? 1 : result
  }, [depth, rootDepth])
  return (
    <a
      data-index={index}
      href={`#${title}`}
      className={clsx(styles['toc-link'], active && styles['active'])}
      style={{
        paddingLeft: depth >= rootDepth ? `${1.2 * renderDepth}rem` : undefined,
      }}
      data-depth={depth}
      onClick={(e) => {
        e.preventDefault()
        onClick(index)
        const $el = document.getElementById(title)
        if ($el) {
          springScrollToElement($el, undefined, -100)
        }
      }}
    >
      <span className={styles['a-pointer']}>{title}</span>
    </a>
  )
})
