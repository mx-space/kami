import markdownEscape from 'markdown-escape'
import type { FC } from 'react'
import React, {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { message } from 'react-message-popup'
import isEmail from 'validator/lib/isEmail'
import isUrl from 'validator/lib/isURL'
import { create } from 'zustand'

import { FloatPopover } from '@mx-space/kami-design/components/FloatPopover'
import {
  GridiconsNoticeOutline,
  MdiEmailFastOutline,
  PhUser,
  SiGlyphGlobal,
} from '@mx-space/kami-design/components/Icons/for-comment'
import { Input } from '@mx-space/kami-design/components/Input'

import { useIsLogged, useUserStore } from '~/atoms/user'
import { ImpressionView } from '~/components/biz/ImpressionView'
import { kaomoji } from '~/constants/kaomoji'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useSyncEffectOnce } from '~/hooks/use-sync-effect'
import { omit, pick, sample } from '~/utils/_'
import { apiClient } from '~/utils/client'
import { isClientSide, isDev } from '~/utils/env'

import styles from './index.module.css'

const USER_PREFIX = 'mx-space-comment-author'
const USER_DRAFT = 'mx-space-comment-draft'

const initialConfig = {
  syncToRecently: false,
  isWhispers: false,
}

const initialState = {
  author: '',
  mail: '',
  url: '',
  text: '',

  ...initialConfig,
}

const createCommentState = () =>
  create<
    typeof initialState & {
      setConfig(config: Partial<typeof initialConfig>): void
    }
  >((setState) => ({
    ...initialState,
    setConfig(config: Partial<typeof initialConfig>) {
      setState(config)
    },
  }))

const commentStoreMap = {} as Record<
  string,
  ReturnType<typeof createCommentState>
>

const FormInputCopyMap = {
  author: '昵称 *',
  mail: '邮箱 *',
  url: '网址',
}
const FormInputIconMap = {
  author: <PhUser />,
  mail: <MdiEmailFastOutline />,
  url: <SiGlyphGlobal />,
}
const FormInput: FC<{
  fieldKey: 'author' | 'mail' | 'url'
  instanceId: string
}> = (props) => {
  const { fieldKey, instanceId: key } = props
  const useCommentStore = commentStoreMap[key]
  const value = useCommentStore((state) => state[fieldKey])
  const onChange = useCallback((e) => {
    useCommentStore.setState({ [fieldKey]: e.target.value })
  }, [])
  return (
    <Input
      placeholder={FormInputCopyMap[fieldKey]}
      required
      name={fieldKey}
      prefix={FormInputIconMap[fieldKey]}
      value={value}
      onChange={onChange}
    />
  )
}

export const CommentBox: FC<{
  onSubmit: ({ text, author, mail, url, isWhispers }) => any
  onCancel?: () => any
  autoFocus?: boolean

  refId: string
  commentId?: string
}> = memo(({ onSubmit, onCancel, autoFocus = false, refId, commentId }) => {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const currentId = useId()
  let useCommentStore = commentStoreMap[currentId]

  useSyncEffectOnce(() => {
    if (!useCommentStore) {
      commentStoreMap[currentId] = createCommentState()
      useCommentStore = commentStoreMap[currentId]
    }

    if (isDev && isClientSide()) {
      useCommentStore.setState({
        author: '测试昵称',
        mail: 'test@innei.ren',
        url: 'https://test.innei.ren',
      })
    }
  })

  useEffect(() => {
    return () => {
      delete commentStoreMap[currentId]
    }
  }, [])

  useEffect(() => {
    const $ref = taRef.current
    if ($ref && isDev) {
      const setText = (text: string) => useCommentStore.setState({ text })
      if (isDev) {
        const testText =
          '幻なんかじゃない 人生は夢じゃない 僕達ははっきりと生きてるんだ'
        $ref.value = testText
        setText(testText)
      } else {
        const draftText = localStorage.getItem(USER_DRAFT) ?? ''
        $ref.value = draftText
        setText(draftText)
      }
    }

    return () => {
      if ($ref && $ref.value) {
        localStorage.setItem(USER_DRAFT, $ref.value)
      }
    }
  }, [])

  const reset = () => {
    if (taRef.current) {
      taRef.current.value = ''

      useCommentStore.setState({
        text: '',
      })
    }
  }

  const handleInsertEmoji = useCallback((emoji: string) => {
    if (!taRef.current) {
      return
    }

    const $ta = taRef.current
    const start = $ta.selectionStart
    const end = $ta.selectionEnd

    $ta.value = `${$ta.value.substring(
      0,
      start,
    )} ${emoji} ${$ta.value.substring(end, $ta.value.length)}`

    useCommentStore.setState({ text: $ta.value })
    requestAnimationFrame(() => {
      const shouldMoveToPos = start + emoji.length + 2
      $ta.selectionStart = shouldMoveToPos
      $ta.selectionEnd = shouldMoveToPos

      $ta.focus()
    })
  }, [])

  const handleCancel = () => {
    onCancel?.()
    reset()
  }

  const handleSubmit = () => {
    if (!taRef.current) {
      return
    }
    const text = taRef.current.value
    const { username: ownerUserName, name: ownerName } =
      useUserStore.getState().master || {}
    const logged = useUserStore.getState().isLogged
    const { author, mail, url, isWhispers, syncToRecently } =
      useCommentStore.getState()
    if (!logged) {
      if (author === ownerName || author === ownerUserName) {
        return message.error('昵称与我主人重名了，但是你好像并不是我的主人唉')
      }
      if (!author || !text || !mail) {
        message.error('小可爱，能把信息填完整么')
        return
      }
      if (url && !isUrl(url, { require_protocol: true })) {
        message.error('小可爱，网址格式不正确哦')
        return
      }
      if (!isEmail(mail)) {
        message.error('小可爱，邮箱格式不正确哦')
        return
      }
      if (author.length > 20) {
        message.error('昵称太长了了啦，服务器会坏掉的')
        return
      }
    }

    if (text.length > 500) {
      message.error('内容太长了了啦，服务器会坏掉的')
      return
    }

    const model = {
      author,
      text,
      mail,
      url: url || undefined,
      isWhispers,
    }
    localStorage.setItem(USER_PREFIX, JSON.stringify(omit(model, ['text'])))
    onSubmit(model).then(() => {
      if (syncToRecently) {
        apiClient.recently.proxy.post({
          data: {
            content: text,
            ref: refId,
          },
        })
      }

      reset()
    })
  }
  useEffect(() => {
    const store = localStorage.getItem(USER_PREFIX)
    if (store) {
      try {
        const model = JSON.parse(store) as {
          author: string
          mail: string
          url: string
        }
        for (const key in model) {
          if (model[key] === 'undefined') {
            model[key] = ''
          }
        }
        useCommentStore.setState(model)
      } catch {}
    }
  }, [])

  const setWrapper = useCallback((fn: (value: string) => void) => {
    return (e: any) => {
      fn(e.target.value)
    }
  }, [])

  const noticeOnce = useRef(false)

  const handleCommentBoxClick = useCallback(() => {
    const isLogged = useUserStore.getState().isLogged
    if (isLogged) {
      return
    }
    if (!noticeOnce.current) {
      message.warn('欧尼酱，文明发言哦，否则评论会被移入垃圾箱哦')
      noticeOnce.current = true
    }
  }, [])

  const logged = useIsLogged()

  const setter = useRef(
    // @ts-ignore
    ['author', 'mail', 'url', 'text'].reduce((acc, key) => {
      acc[key] = setWrapper((e) => {
        useCommentStore.setState({ [key]: e })
      })
      return acc
    }, {}),
  ).current

  const isWhispers = useCommentStore((state) => state.isWhispers)
  const text = useCommentStore((state) => state.text)

  return (
    <div className="my-4">
      {!logged && (
        <div className={styles['comment-box-head']}>
          <FormInput fieldKey="author" instanceId={currentId} />
          <FormInput fieldKey="mail" instanceId={currentId} />
          <FormInput fieldKey="url" instanceId={currentId} />
        </div>
      )}
      <Input
        // @ts-ignore
        ref={taRef}
        multi
        maxLength={500}
        // @ts-ignore
        rows={4}
        required
        onChange={setter['text']}
        autoFocus={autoFocus}
        onClick={handleCommentBoxClick}
        wrapperProps={useMemo(
          () => ({
            className: isWhispers ? styles['whispers-input'] : '',
          }),
          [isWhispers],
        )}
        placeholder={
          !logged
            ? '嘿 ︿(￣︶￣)︿, 留个评论好不好嘛~'
            : '主人，说点什么好呢？'
        }
      />

      <div
        className={'relative flex justify-between mt-2 flex-wrap items-center'}
      >
        <div className="flex-shrink-0 flex space-x-2 items-center">
          <MarkdownSupport />
          <KaomojiButton onClickKaomoji={handleInsertEmoji} />
        </div>

        <div className={'whitespace-nowrap flex-shrink-0 flex items-center'}>
          <CommentBoxOption
            refId={refId}
            commentId={commentId}
            instanceId={currentId}
          />

          {onCancel && (
            <button className="btn red" onClick={handleCancel}>
              取消回复
            </button>
          )}
          <button
            className="btn yellow ml-[12px]"
            onClick={handleSubmit}
            disabled={text.trim().length === 0}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
})

const CommentBoxOption: FC<{
  commentId?: string
  refId: string
  instanceId: string
}> = (props) => {
  const isLogged = useIsLogged()
  const useCommentStore = commentStoreMap[props.instanceId]
  const { syncToRecently, isWhispers } = useCommentStore((state) =>
    pick(state, ['syncToRecently', 'isWhispers']),
  )
  const setConfig = useCommentStore.getState().setConfig
  const isReply = !!props.commentId

  return (
    <>
      {isLogged && !isReply && (
        <fieldset className="inline-flex items-center children:cursor-pointer">
          <input
            type="checkbox"
            id="comment-box-sync"
            checked={syncToRecently}
            onChange={(e) => {
              setConfig({ syncToRecently: e.target.checked })
            }}
          />
          <label htmlFor="comment-box-sync" className="text-shizuku">
            同步到速记
          </label>
        </fieldset>
      )}
      {!isLogged && !isReply && (
        <fieldset className="inline-flex items-center children:cursor-pointer">
          <input
            type="checkbox"
            id="comment-box-whispers"
            checked={isWhispers}
            onChange={(e) => {
              setConfig({ isWhispers: e.target.checked })
            }}
          />
          <label htmlFor="comment-box-whispers" className="text-shizuku">
            悄悄话
          </label>
        </fieldset>
      )}
    </>
  )
}
const MarkdownSupport = () => {
  return (
    <FloatPopover
      triggerComponent={
        useRef(() => (
          <button
            aria-label="support markdown"
            className="btn blue text-lg flex-shrink-0 mr-2 cursor-default pointer-events-none !p-2 rounded-full"
          >
            <GridiconsNoticeOutline />
          </button>
        )).current
      }
    >
      <div className="leading-7">
        <p>评论支持部分 Markdown 语法</p>
        <p>评论可能被移入垃圾箱</p>
        <p>评论可能需要审核，审核通过后才会显示</p>
      </div>
    </FloatPopover>
  )
}
const KaomojiButton: FC<{ onClickKaomoji: (kaomoji: string) => any }> = memo(
  ({ onClickKaomoji }) => {
    const { event } = useAnalyze()
    const [trackerOnce, setOnce] = useState(false)
    const randomKaomoji = useRef(sample(kaomoji))
    const handleTrack = useCallback(() => {
      setOnce(true)
    }, [])
    return (
      <FloatPopover
        trigger="both"
        wrapperClassNames="flex-shrink-0"
        triggerComponent={memo(() => (
          <button className="btn green mr-[12px] cursor-pointer">
            {randomKaomoji.current}
          </button>
        ))}
      >
        <ImpressionView
          shouldTrack={!trackerOnce}
          trackerMessage="曝光 Kaomoji 面板"
          onTrack={handleTrack}
        >
          <div className="w-[300px] overflow-auto max-w-[80vw] h-[300px] max-h-[50vh]">
            {kaomoji.map((emoji, i) => (
              <button
                aria-label="kaomoji panel"
                className="text-blue p-2"
                key={i}
                onClick={() => {
                  event({
                    action: TrackerAction.Click,
                    label: 'Kaomoji',
                  })
                  onClickKaomoji(markdownEscape(emoji))
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </ImpressionView>
      </FloatPopover>
    )
  },
)
