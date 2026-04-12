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
import { useTranslations } from 'next-intl'
import { message } from 'react-message-popup'
import isEmail from 'validator/lib/isEmail'
import isUrl from 'validator/lib/isURL'
import { createWithEqualityFn } from 'zustand/traditional'

import { useIsLogged, useUserStore } from '~/atoms/user'
import { ImpressionView } from '~/components/common/ImpressionView'
import { Button } from '~/components/ui/Button'
import { FloatPopover } from '~/components/ui/FloatPopover'
import {
  GridiconsNoticeOutline,
  MdiEmailFastOutline,
  PhUser,
  SiGlyphGlobal,
} from '~/components/ui/Icons/for-comment'
import { Input } from '~/components/ui/Input'
import { kaomoji } from '~/constants/kaomoji'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useSyncEffectOnce } from '~/hooks/common/use-sync-effect'
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
  createWithEqualityFn<
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
  const t = useTranslations('comment')
  const placeholder =
    fieldKey === 'author'
      ? t('authorPlaceholder')
      : fieldKey === 'mail'
        ? t('mailPlaceholder')
        : t('urlPlaceholder')
  const useCommentStore = commentStoreMap[key]
  const value = useCommentStore((state) => state[fieldKey])
  const onChange = useCallback((e) => {
    useCommentStore.setState({ [fieldKey]: e.target.value })
  }, [fieldKey, useCommentStore])
  return (
    <Input
      placeholder={placeholder}
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
  const t = useTranslations('comment')
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
        return message.error(t('sameNameError'))
      }
      if (!author || !text || !mail) {
        message.error(t('fillRequired'))
        return
      }
      if (url && !isUrl(url, { require_protocol: true })) {
        message.error(t('invalidUrl'))
        return
      }
      if (!isEmail(mail)) {
        message.error(t('invalidMail'))
        return
      }
      if (author.length > 20) {
        message.error(t('authorTooLong'))
        return
      }
    }

    if (text.length > 500) {
      message.error(t('contentTooLong'))
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
      } catch {
        // ignore invalid stored data
      }
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
      message.warn(t('beCivil'))
      noticeOnce.current = true
    }
  }, [t])

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
          !logged ? t('placeholder') : t('placeholderOwner')
        }
      />

      <div className="relative mt-2 flex flex-wrap items-center justify-between">
        <div className="flex shrink-0 items-center space-x-2">
          <MarkdownSupport />
          <KaomojiButton onClickKaomoji={handleInsertEmoji} />
        </div>

        <div className="flex shrink-0 items-center whitespace-nowrap">
          <CommentBoxOption
            refId={refId}
            commentId={commentId}
            instanceId={currentId}
          />

          {onCancel && (
            <Button
              className="btn !border-red !text-red !bg-transparent"
              onClick={handleCancel}
            >
              {t('cancelReply')}
            </Button>
          )}
          <Button
            className="btn ml-[12px]"
            onClick={handleSubmit}
            disabled={text.trim().length === 0}
          >
            {t('send')}
          </Button>
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
  const t = useTranslations('comment')
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
        <fieldset className="children:cursor-pointer inline-flex items-center">
          <input
            type="checkbox"
            id="comment-box-sync"
            checked={syncToRecently}
            onChange={(e) => {
              setConfig({ syncToRecently: e.target.checked })
            }}
          />
          <label htmlFor="comment-box-sync" className="text-shizuku">
            {t('syncToSay')}
          </label>
        </fieldset>
      )}
      {!isLogged && !isReply && (
        <fieldset className="children:cursor-pointer inline-flex items-center">
          <input
            type="checkbox"
            id="comment-box-whispers"
            checked={isWhispers}
            onChange={(e) => {
              setConfig({ isWhispers: e.target.checked })
            }}
          />
          <label htmlFor="comment-box-whispers" className="text-shizuku">
            {t('secret')}
          </label>
        </fieldset>
      )}
    </>
  )
}
const MarkdownSupport = () => {
  const t = useTranslations('comment')
  return (
    <FloatPopover
      triggerComponent={
        useRef(() => (
          <Button
            aria-label="support markdown"
            className="btn !text-secondary pointer-events-none mr-2 shrink-0 cursor-not-allowed rounded-full border-2 !border-current !bg-transparent !p-2 text-lg"
          >
            <GridiconsNoticeOutline />
          </Button>
        )).current
      }
    >
      <div className="leading-7">
        <p>{t('markdownHint')}</p>
        <p>{t('spamHint')}</p>
        <p>{t('moderateHint')}</p>
      </div>
    </FloatPopover>
  )
}
const KaomojiButton: FC<{ onClickKaomoji: (kaomoji: string) => any }> = memo(
  ({ onClickKaomoji }) => {
    const t = useTranslations('comment')
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
          <Button className="btn !bg-secondary mr-[12px] cursor-pointer">
            {randomKaomoji.current}
          </Button>
        ))}
      >
        <ImpressionView
          shouldTrack={!trackerOnce}
          trackerMessage={t('trackKaomojiPanel')}
          onTrack={handleTrack}
        >
          <div className="size-[300px] max-h-[50vh] max-w-[80vw] overflow-auto">
            {kaomoji.map((emoji, i) => (
              <Button
                aria-label="kaomoji panel"
                className="!text-secondary !bg-transparent p-2"
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
              </Button>
            ))}
          </div>
        </ImpressionView>
      </FloatPopover>
    )
  },
)
