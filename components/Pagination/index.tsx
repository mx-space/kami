import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { message } from 'antd'
import { FC, useEffect, useState } from 'react'
import styles from './index.module.scss'
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
      {
        <FontAwesomeIcon
          icon={faArrowLeft}
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
        />
      }
      <div className={styles['nav']}>
        <input
          value={value}
          type="text"
          className={styles['input']}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
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
        / {total}
      </div>
      <FontAwesomeIcon
        icon={faArrowRight}
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
      />
    </div>
  )
}
