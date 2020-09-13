import { message } from 'utils/message'
import Markdown from 'components/MD-render'
import sample from 'lodash/sample'
import { CommentModel } from 'models/comment'
import rc from 'randomcolor'
import QueueAnim from 'rc-queue-anim'
import {
  DetailedHTMLProps,
  FC,
  Fragment,
  HTMLAttributes,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import LazyLoad from 'react-lazyload'
import { Rest } from 'utils/api'
import { observer } from 'utils/mobx'
import { relativeTimeFromNow } from 'utils/time'
import { CommentContext, minHeightProperty, openCommentMessage } from '.'
import { useStore } from '../../common/store'
import { animatingClassName } from '../../layouts/NoteLayout'
import CommentBox from './box'
import styles from './index.module.scss'

interface CommentProps {
  author: JSX.Element
  avatar: JSX.Element
  content: JSX.Element
  datetime: string
  actions?: (JSX.Element | null)[]
}

const Comment: FC<
  CommentProps &
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  const {
    actions,
    author,
    children,
    avatar,
    content,
    datetime,
    ...rest
  } = props
  return (
    <div className={styles['comment']} {...rest}>
      <div className={styles['inner']}>
        <div className={styles['comment-avatar']}>{avatar}</div>
        <div className={styles['content']}>
          <div className={styles['content-author']}>
            <span className={styles['name']}>{author}</span>
            <span className={styles['datetime']}>{datetime}</span>
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
}

const generateColorFromMode = (
  mode: 'bright' | 'light' | 'dark' | 'random' | undefined,
) => {
  return rc({ luminosity: mode, alpha: 0.28, format: 'hex' })
}
type AvatarProps = {
  src: string
}

const Avatar: FC<AvatarProps> = observer(({ src }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const image = new Image()
    image.src = src
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      setReady(true)
    }
  }, [src])
  const { appStore } = useStore()
  const randomColor = useMemo(() => {
    if (appStore.colorMode === 'dark') {
      return generateColorFromMode('dark')
    } else {
      return generateColorFromMode('light')
    }
  }, [appStore.colorMode])

  return (
    <div
      className={styles['guest-avatar']}
      style={ready ? undefined : { backgroundColor: randomColor }}
    >
      <LazyLoad offset={250}>
        <div
          className={styles['avatar']}
          style={
            ready ? { backgroundImage: `url(${src})`, opacity: 1 } : undefined
          }
        ></div>
      </LazyLoad>
    </div>
  )
})

const Empty: FC = () => {
  return (
    <div style={{ ...minHeightProperty }} className={styles['empty']}>
      <svg
        version="1.1"
        x="0px"
        y="0px"
        width="59.227px"
        height="59.227px"
        viewBox="0 0 59.227 59.227"
        style={{ fill: 'var(--shizuku-text-color)' }}
      >
        <g>
          <g>
            <path
              d="M51.586,10.029c-0.333-0.475-0.897-0.689-1.449-0.607c-0.021-0.005-0.042-0.014-0.063-0.017L27.469,6.087
			c-0.247-0.037-0.499-0.01-0.734,0.076L8.63,12.799c-0.008,0.003-0.015,0.008-0.023,0.011c-0.019,0.008-0.037,0.02-0.057,0.027
			c-0.099,0.044-0.191,0.096-0.276,0.157c-0.026,0.019-0.051,0.038-0.077,0.059c-0.093,0.076-0.178,0.159-0.249,0.254
			c-0.004,0.006-0.01,0.009-0.014,0.015L0.289,23.78c-0.293,0.401-0.369,0.923-0.202,1.391c0.167,0.469,0.556,0.823,1.038,0.947
			l6.634,1.713v16.401c0,0.659,0.431,1.242,1.062,1.435l24.29,7.422c0.008,0.004,0.017,0.001,0.025,0.005
			c0.13,0.036,0.266,0.059,0.402,0.06c0.003,0,0.007,0.002,0.011,0.002l0,0h0.001c0.143,0,0.283-0.026,0.423-0.067
			c0.044-0.014,0.085-0.033,0.13-0.052c0.059-0.022,0.117-0.038,0.175-0.068l17.43-9.673c0.477-0.265,0.772-0.767,0.772-1.312
			V25.586l5.896-2.83c0.397-0.19,0.69-0.547,0.802-0.973c0.111-0.427,0.03-0.88-0.223-1.241L51.586,10.029z M27.41,9.111
			l17.644,2.59L33.35,17.143l-18.534-3.415L27.41,9.111z M9.801,15.854l21.237,3.914l-6.242,9.364l-20.78-5.365L9.801,15.854z
			 M10.759,43.122V28.605l14.318,3.697c0.125,0.031,0.25,0.048,0.375,0.048c0.493,0,0.965-0.244,1.248-0.668l5.349-8.023v25.968
			L10.759,43.122z M49.479,41.1l-14.431,8.007V25.414l2.635,5.599c0.171,0.361,0.479,0.641,0.854,0.773
			c0.163,0.06,0.333,0.087,0.502,0.087c0.223,0,0.444-0.05,0.649-0.146l9.789-4.698L49.479,41.1L49.479,41.1z M39.755,28.368
			l-4.207-8.938L49.85,12.78l5.634,8.037L39.755,28.368z"
            />
          </g>
        </g>
      </svg>
      {sample([
        '这里空空如也...',
        '客观, 感觉如何?',
        '嘿, 小可爱, 说点什么呢?',
      ])}
    </div>
  )
}

function getCommentWrap<T extends { _id: string }>(comment: T) {
  const $wrap = document.getElementById('comments-wrap')
  if (!$wrap) {
    return
  }
  const $parent = $wrap.querySelector<HTMLDivElement>(
    '[data-comment-id="'.concat(comment._id, '"] #write'),
  )
  return $parent
}

const Comments: FC<{
  comments: CommentModel[]
  onFetch: (page?: number, size?: number, force?: boolean) => void
  id: string
}> = memo(({ comments, onFetch: fetchComments, id }) => {
  const { refresh, collection } = useContext(CommentContext)
  const [replyId, setReplyId] = useState('')
  const { userStore } = useStore()
  const logged = userStore.isLogged

  const [sure, setSure] = useState(false)
  if (comments.length === 0) {
    return <Empty />
  }
  const renderSingleComment = (
    comment: CommentModel,
    children?: JSX.Element | JSX.Element[],
  ) => {
    const handleReply = async (model) => {
      openCommentMessage()
      if (logged) {
        await Rest('Comment', 'master/reply/' + comment._id).post(model)
      } else {
        await Rest('Comment', 'reply/' + comment._id).post(model)
      }
      openCommentMessage.success()
      refresh()
      setReplyId('')
    }
    const handleDelete = (id: string) => async () => {
      await Rest('Comment').del(id)
      message.success('删除成功~')
      fetchComments(undefined, undefined, true)
    }
    const getUrl = () => {
      try {
        const host = new URL(comment.url).host
        return '//' + host
      } catch {
        return undefined
      }
    }
    const url = getUrl()

    return (
      <Comment
        key={comment._id}
        data-comment-id={comment._id}
        author={
          <a href={url} rel={'nofollow'}>
            {comment.author}
          </a>
        }
        avatar={<Avatar src={comment.avatar?.concat('?d=identicon')} />}
        content={
          <Markdown
            value={`${
              comment.parent
                ? `@${collection.get(comment.parent)?._id || ''} `
                : ''
            }${comment.text}`}
            className={styles['comment']}
            skipHtml
            escapeHtml
            renderers={{
              commentAt: ({ value }) => {
                const comment = collection.get(value)
                if (!comment) {
                  return null
                }

                return (
                  <a
                    href={'javascript:;'}
                    className={styles['comment-at']}
                    onMouseOver={(e) => {
                      e.stopPropagation()
                      const $parent = getCommentWrap(comment)

                      if (!$parent) {
                        return
                      }
                      // $parent.classList.add('highlight')
                      $parent.getAnimations?.().forEach((i) => i.cancel())
                      const animate = $parent.animate(
                        [
                          {
                            backgroundColor: 'transparent',
                          },
                          {
                            backgroundColor: '#FFEBC9ee',
                          },
                        ],
                        {
                          duration: 1000,
                          iterations: Infinity,
                          direction: 'alternate',
                          easing: 'linear',
                          fill: 'both',
                        },
                      )

                      if (typeof $parent.getAnimations === 'undefined') {
                        $parent.getAnimations = () => {
                          return [animate]
                        }
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation()
                      const $parent = getCommentWrap(comment)

                      if (!$parent) {
                        return
                      }
                      // $parent.classList.add('highlight')

                      // support only Chrome >= 79 (behind the Experimental Web Platform Features preference)
                      $parent.getAnimations?.().forEach((a) => a.cancel())
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      const $parent = getCommentWrap(comment)
                      if (!$parent) {
                        return
                      }
                      $parent.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      })
                      $parent.animate([
                        {
                          backgroundColor: '#FFEBC9',
                        },
                        {
                          backgroundColor: 'transparent',
                        },
                      ])
                    }}
                  >
                    @{comment.author}
                  </a>
                )
              },
            }}
          />
        }
        datetime={relativeTimeFromNow(comment.created) + ' ' + comment.key}
        actions={[
          <span
            key="comment-list-reply-to-0"
            onClick={() => {
              if (replyId !== comment.id) setReplyId(comment._id)
              else setReplyId('')
            }}
          >
            {replyId !== comment.id ? '回复' : '取消回复'}
          </span>,
          logged ? (
            <Fragment>
              {!sure && (
                <span
                  key="comment-list-delete"
                  onClick={() => {
                    setSure(true)
                    setTimeout(() => {
                      try {
                        setSure(false)
                        // eslint-disable-next-line no-empty
                      } catch {}
                    }, 8000)
                  }}
                >
                  删除
                </span>
              )}
              {sure && (
                <span
                  key="comment-list-delete"
                  onClick={() => {
                    handleDelete(comment._id)()
                    setSure(false)
                  }}
                  style={{ color: '#e74c3c' }}
                >
                  真的需要删除?
                </span>
              )}
            </Fragment>
          ) : null,
        ]}
      >
        <QueueAnim
          appear
          forcedReplay
          leaveReverse
          type={'bottom'}
          duration={500}
        >
          {replyId === comment._id && (
            <CommentBox
              key={'box'}
              onSubmit={handleReply}
              onCancel={() => setReplyId('')}
            />
          )}
        </QueueAnim>

        {children}
      </Comment>
    )
  }
  const renderComments = (comment: CommentModel) => {
    if (comment.children.length > 0) {
      const children = comment.children
      const childComments = children.map((child: CommentModel) => {
        return renderComments(child)
      })

      return renderSingleComment(comment, childComments)
    }
    return renderSingleComment(comment)
  }

  return (
    <QueueAnim
      delay={300}
      duration={500}
      animConfig={{ opacity: [1, 0], translateY: [0, 50] }}
      animatingClassName={animatingClassName}
      style={{ ...minHeightProperty }}
    >
      <div key={comments.length} id={'comments-wrap'}>
        {comments.map((comment) => {
          return renderComments(comment)
        })}
      </div>
    </QueueAnim>
  )
})
export default Comments
