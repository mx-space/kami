import { sample } from 'lodash-es'
import omit from 'lodash-es/omit'
import type { FC } from 'react'
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { message } from 'react-message-popup'
import { isDev } from 'utils'
import isEmail from 'validator/lib/isEmail'
import isUrl from 'validator/lib/isURL'

import { FloatPopover } from '~/components/universal/FloatPopover'
import {
  MdiEmailFastOutline,
  MdiLanguageMarkdown,
  PhUser,
  SiGlyphGlobal,
} from '~/components/universal/Icons'
import { ImpressionView } from '~/components/universal/ImpressionView'
import { kaomoji } from '~/constants/kaomoji'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'

import { useStore } from '../../../store'
import { Input } from '../../universal/Input'
import styles from './index.module.css'

const USER_PREFIX = 'mx-space-comment-author'
const USER_DRAFT = 'mx-space-comment-draft'

export const CommentBox: FC<{
  onSubmit: ({ text, author, mail, url }) => any
  onCancel?: () => any
  autoFocus?: boolean
}> = memo(({ onSubmit, onCancel, autoFocus = false }) => {
  const [author, setAuthor] = useState(isDev ? '测试昵称' : '')
  const [mail, setMail] = useState(isDev ? 'test@innei.ren' : '')
  const [url, setUrl] = useState(isDev ? 'https://test.innei.ren' : '')
  const [text, setText] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const $ref = taRef.current
    if ($ref && isDev) {
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

  const { userStore } = useStore()
  const logged = userStore.isLogged
  const reset = () => {
    if (taRef.current) {
      taRef.current.value = ''
      setText('')
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
    setText($ta.value) // force update react state.
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

    if (!logged) {
      if (author === userStore.name || author === userStore.username) {
        return message.error('昵称与我主人重名了, 但是你好像并不是我的主人唉')
      }
      if (!author || !text || !mail) {
        message.error('小可爱, 能把信息填完整么')
        return
      }
      if (url && !isUrl(url, { require_protocol: true })) {
        message.error('小可爱, 网址格式不正确哦')
        return
      }
      if (!isEmail(mail)) {
        message.error('小可爱, 邮箱格式不正确哦')
        return
      }
      if (author.length > 20) {
        message.error('昵称太长了了啦, 服务器会坏掉的')
        return
      }
    }

    if (text.length > 500) {
      message.error('内容太长了了啦, 服务器会坏掉的')
      return
    }
    const model = {
      author,
      text,
      mail,
      url: url || undefined,
    }
    localStorage.setItem(USER_PREFIX, JSON.stringify(omit(model, ['text'])))
    onSubmit(model).then(() => {
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
        setMail(model.mail || '')
        setAuthor(model.author || '')
        setUrl(model.url || '')
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }, [])

  const setWrapper = useCallback((fn: any) => {
    return (e: any) => {
      fn(e.target.value)
    }
  }, [])

  const setter = useMemo(
    () => ({
      author: setWrapper(setAuthor),
      mail: setWrapper(setMail),
      url: setWrapper(setUrl),
      text: setWrapper(setText),
    }),
    [],
  )

  const prefixIcon = useMemo(
    () => ({
      author: <PhUser />,
      mail: <MdiEmailFastOutline />,
      url: <SiGlyphGlobal />,
    }),
    [],
  )

  const handleCommentBoxClick = useCallback(() => {
    if (userStore.isLogged) {
      return
    }

    message.warn('欧尼酱，文明发言哦，否则评论会被移入垃圾箱哦')
  }, [userStore.isLogged])
  return (
    <div className="my-4">
      {!logged && (
        <div className={styles['comment-box-head']}>
          <Input
            placeholder={'昵称 *'}
            required
            name={'author'}
            prefix={prefixIcon['author']}
            value={author}
            onChange={setter['author']}
          />
          <Input
            placeholder={'邮箱 *'}
            name={'mail'}
            required
            prefix={prefixIcon['mail']}
            value={mail}
            onChange={setter['mail']}
          />
          <Input
            placeholder={'网站 https?://'}
            name={'website'}
            prefix={prefixIcon['url']}
            value={url}
            onChange={setter['url']}
          />
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
        placeholder={
          !logged
            ? '嘿 ︿(￣︶￣)︿, 留个评论好不好嘛~'
            : '主人, 说点什么好呢? '
        }
      />

      <div
        className={'relative flex justify-between mt-2 flex-wrap items-center'}
      >
        <div className="flex-shrink-0 flex space-x-2 items-center">
          <FloatPopover
            triggerComponent={() => (
              <button
                aria-label="support markdown"
                className="btn blue text-lg flex-shrink-0 mr-[12px] cursor-default pointer-events-none"
              >
                <MdiLanguageMarkdown />
              </button>
            )}
          >
            评论支持部分 Markdown 语法
          </FloatPopover>
          <KaomojiButton onClickKaomoji={handleInsertEmoji} />
        </div>

        <div className={'whitespace-nowrap flex-shrink-0'}>
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
                  onClickKaomoji(emoji)
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
