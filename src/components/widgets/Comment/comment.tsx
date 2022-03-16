import { RelativeTime } from 'components/universal/RelativeTime'
import { DetailedHTMLProps, FC, HTMLAttributes, memo, useMemo } from 'react'
import styles from './index.module.css'

interface CommentProps {
  author: JSX.Element
  avatar: JSX.Element
  content: JSX.Element
  datetime: string
  commentKey: string
  actions?: (JSX.Element | null)[]
}

export const Comment: FC<
  CommentProps &
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = memo((props) => {
  const {
    actions,
    author,
    children,
    avatar,
    content,
    datetime,
    commentKey,
    ...rest
  } = props
  const key = useMemo(() => {
    const keyArr = commentKey.split('#').slice(1)
    return `#${
      keyArr.length > 5
        ? `${keyArr.slice(0, 3).join('.')}...${keyArr
            .slice(4, keyArr.length - 1)
            .reduce((acc, cur) => acc + +cur, 0)}+${keyArr.at(-1)}`
        : keyArr.join('.')
    }`
  }, [commentKey])
  return (
    <div className={styles['comment']} {...rest}>
      <div className={styles['inner']}>
        <div className={styles['comment-avatar']}>{avatar}</div>
        <div className={styles['content']}>
          <div className={styles['content-author']}>
            <span className={styles['name']}>{author}</span>
            <span className={styles['datetime']}>
              <RelativeTime date={datetime} />{' '}
              <span className="truncate break-all">{key}</span>
            </span>
          </div>
          <div className={styles['detail']}>{content}</div>
          <ul className={styles['actions']}>
            {actions && actions.map((action, i) => <li key={i}>{action}</li>)}
          </ul>
        </div>
      </div>
      <div className={styles['nested']}>{children}</div>
    </div>
  )
})
