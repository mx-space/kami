import { FC, useEffect, useState } from 'react'
import { message } from 'utils/message'
import styles from './index.module.css'
interface PaginationProps {
  total: number
  current: number
  onChange: (next: number) => void
  hideOnSinglePage?: boolean
}
export const Pagination: FC<PaginationProps> = (props) => {
  const { total, current, onChange, hideOnSinglePage = false } = props
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
        width="2em"
        height="2em"
        viewBox="0 0 24 24"
        className={styles['icon']}
        style={
          current - 1 <= 0
            ? {
                cursor: 'not-allowed',
                opacity: '0.8',
              }
            : undefined
        }
        onClick={() => {
          const prev = current - 1
          if (prev > 0) {
            onChange(current - 1)
          }
        }}
      >
        <path
          d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6l1.41-1.41z"
          fill="currentColor"
        ></path>
      </svg>

      <div className={styles['nav']}>
        <input
          value={value}
          type="text"
          className={styles['input']}
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
        <span>/ {total}</span>
      </div>
      <svg
        width="2em"
        height="2em"
        viewBox="0 0 24 24"
        className={styles['icon']}
        onClick={() => {
          const next = current + 1
          if (next <= total) {
            onChange(current + 1)
          }
        }}
        style={
          current + 1 > total
            ? {
                cursor: 'not-allowed',
                opacity: '0.8',
              }
            : undefined
        }
      >
        <path
          d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  )
}
