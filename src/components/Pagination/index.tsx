import { Input } from 'components/Input'
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
          d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42z"
          fill="currentColor"
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
        <span className="flex-shrink-0">/ {total}</span>
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
          d="M9.29 15.88L13.17 12L9.29 8.12a.996.996 0 1 1 1.41-1.41l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3a.996.996 0 0 1-1.41 0c-.38-.39-.39-1.03 0-1.42z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  )
}
