import { clsx } from 'clsx'
import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'
import { memo, useCallback, useMemo } from 'react'

import { RelativeTime } from '~/components/common/RelativeTime'
import { LaUserSecret } from '~/components/ui/Icons/for-comment'
import { springScrollToElement } from '~/utils/spring'

import styles from './index.module.css'

interface CommentProps {
  author: JSX.Element
  avatar: JSX.Element
  content: JSX.Element
  datetime: string
  commentKey: string
  location?: string
  actions?: (JSX.Element | null)[]
  highlight?: boolean
  whispers?: boolean
}

export const Comment: FC<
  CommentProps &
    Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      'content'
    >
> = memo((props) => {
  const {
    actions,
    author,
    children,
    avatar,
    whispers,
    content,
    datetime,
    commentKey,
    highlight,
    id,

    location,
    ...rest
  } = props
  const { className, ...htmlProps } = rest
  const key = useMemo(() => {
    const keyArr = commentKey.split('#').slice(1)
    return `#${
      keyArr.length > 5
        ? `${keyArr.slice(0, 3).join('.')}...${keyArr
            .slice(4, keyArr.length - 1)
            .reduce((acc, cur) => acc + +cur, 0)}+${keyArr[keyArr.length - 1]}`
        : keyArr.join('.')
    }`
  }, [commentKey])
  const handleJump = useCallback(() => {
    if (!id) {
      return
    }
    const $el = document.getElementById(id)

    if ($el) springScrollToElement($el, -window.innerHeight / 2 + 50)
  }, [id])
  return (
    <div className={clsx(styles['comment'], className)} id={id} {...htmlProps}>
      <div className={clsx(highlight && styles['highlight'], styles['inner'])}>
        <div className={styles['comment-avatar']}>{avatar}</div>
        <div className={styles['content']}>
          <div className={styles['content-author']}>
            <span className={styles['name']}>{author}</span>
            <span className={styles['datetime']}>
              <RelativeTime date={datetime} />{' '}
              <span
                className="cursor-pointer truncate break-all"
                onClick={handleJump}
              >
                {key}
              </span>
            </span>
            {location && <span>来自：{location}</span>}
            {whispers && <LaUserSecret />}
          </div>
          <div className="text-shizuku-text">{content}</div>
          <ul className={styles['actions']}>
            {actions && actions.map((action, i) => <li key={i}>{action}</li>)}
          </ul>
        </div>
      </div>
      <div className={styles['nested']}>{children}</div>
    </div>
  )
})
