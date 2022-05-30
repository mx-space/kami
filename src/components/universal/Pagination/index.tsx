import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { message } from 'react-message-popup'

import { Input } from '~/components/universal/Input'

import styles from './index.module.css'

interface PaginationProps {
  total: number
  current: number
  onChange: (next: number) => void
  hideOnSinglePage?: boolean
}
const noStyle = {
  pointerEvents: 'none',
  opacity: '0',
} as const
export const Pagination: FC<PaginationProps> = (props) => {
  const { total, current, onChange, hideOnSinglePage = true } = props
  const [value, setValue] = useState(current.toString())
  useEffect(() => {
    setValue(current.toString())
  }, [current])
  if (hideOnSinglePage && total <= 1) {
    return null
  }

  return (
    <div className={styles['pager']}>
      <svg
        className={styles['icon']}
        style={current - 1 <= 0 ? noStyle : undefined}
        onClick={() => {
          const prev = current - 1
          if (prev > 0) {
            onChange(current - 1)
          }
        }}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6l1.41-1.41z"
        ></path>
      </svg>

      <div className={styles['nav']}>
        <Input
          value={value}
          type="text"
          wrapperProps={{ className: styles['input'] }}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13 || e.key == 'Enter' || e.code == 'Enter') {
              const _value = parseInt(value)
              if (_value > total || _value <= 0) {
                return message.error(
                  '页数输入错误, 应在 1 - '.concat(total.toString(), ' 之间'),
                )
              }
              // @ts-ignore
              onChange(parseInt(e.target.value))
            }
          }}
        />
        <span className="flex-shrink-0">
          / <span className="ml-4">{total}</span>
        </span>
      </div>
      <svg
        width="1em"
        height="1em"
        onClick={() => {
          const next = current + 1
          if (next <= total) {
            onChange(current + 1)
          }
        }}
        style={current + 1 > total ? noStyle : undefined}
        className={styles['icon']}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"
        ></path>
      </svg>
    </div>
  )
}
