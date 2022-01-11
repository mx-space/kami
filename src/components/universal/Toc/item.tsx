import clsx from 'clsx'
import { FC, memo } from 'react'
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
  return (
    <a
      data-scroll
      href={'#' + title}
      className={clsx(styles['toc-link'], active && styles['active'])}
      style={{
        paddingLeft:
          depth > rootDepth ? `${1.2 * depth - rootDepth}rem` : undefined,
      }}
      data-depth={depth}
      onClick={(e) => {
        onClick(index)
        if (typeof window.SmoothScroll === 'undefined') {
          e.preventDefault()
          const el = document.getElementById(title)
          el?.scrollIntoView({ behavior: 'smooth' })
        }
      }}
    >
      <span className={styles['a-pointer']}>{title}</span>
    </a>
  )
})
