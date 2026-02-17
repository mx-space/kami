/**
 * 申请友链的表单
 */
import type { FC } from 'react'
import { useCallback, useReducer } from 'react'
import { useTranslations } from 'next-intl'
import { message } from 'react-message-popup'

import {
  MdiEmailFastOutline,
  PhUser,
  RadixIconsAvatar,
  SiGlyphGlobal,
} from '~/components/ui/Icons/for-comment'
import { MdiFountainPenTip } from '~/components/ui/Icons/for-note'
import { Input } from '~/components/ui/Input'
import { apiClient } from '~/utils/client'

import styles from './index.module.css'

const initialState = {
  author: '',
  avatar: '',
  description: '',
  email: '',
  url: '',
  name: '',
}

type Action =
  | { type: 'set'; data: Partial<typeof initialState> }
  | { type: 'reset' }

const useFormData = () => {
  const [state, dispatch] = useReducer(
    (state: typeof initialState, payload: Action) => {
      switch (payload.type) {
        case 'set':
          return { ...state, ...payload.data }
        case 'reset':
          return initialState
      }
    },
    { ...initialState },
  )
  return [state, dispatch] as const
}
export const ApplyForLink: FC = () => {
  const t = useTranslations('friend')
  const [state, dispatch] = useFormData()
  const handleSubmit = useCallback(() => {
    const { author, avatar, description: desc, email, url, name } = state
    if (!author) {
      message.error(t('authorRequired'))
      return
    }
    if (!avatar) {
      message.error(t('avatarRequired'))
      return
    }
    if (!desc) {
      message.error(t('descRequired'))
      return
    }
    if (!email) {
      message.error(t('emailRequired'))
      return
    }
    if (!url) {
      message.error(t('urlRequired'))
      return
    }
    if (!name) {
      message.error(t('nameRequired'))
      return
    }

    apiClient.link.applyLink({ ...state }).then(() => {
      dispatch({ type: 'reset' })
    })
  }, [state, t])

  const handleReset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [])
  return (
    <article className={styles.wrap}>
      <h1>{t('title')}</h1>
      <form
        action="src/components/in-page/Friend/ApplyLink#"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder={t('authorPlaceholder')}
          required
          prefix={<PhUser />}
          value={state.author}
          onChange={(e) => {
            dispatch({ type: 'set', data: { author: e.target.value } })
          }}
        />
        <Input
          placeholder={t('namePlaceholder')}
          required
          prefix={<MdiFountainPenTip />}
          value={state.name}
          onChange={(e) => {
            dispatch({ type: 'set', data: { name: e.target.value } })
          }}
        />
        <Input
          placeholder={t('urlPlaceholder')}
          required
          prefix={<SiGlyphGlobal />}
          value={state.url}
          onChange={(e) => {
            dispatch({ type: 'set', data: { url: e.target.value } })
          }}
        />
        <Input
          placeholder={t('avatarPlaceholder')}
          required
          prefix={<RadixIconsAvatar />}
          value={state.avatar}
          onChange={(e) => {
            dispatch({ type: 'set', data: { avatar: e.target.value } })
          }}
        />
        <Input
          placeholder={t('emailPlaceholder')}
          required
          prefix={<MdiEmailFastOutline />}
          value={state.email}
          onChange={(e) => {
            dispatch({ type: 'set', data: { email: e.target.value } })
          }}
        />
        <Input
          multi
          maxLength={50}
          placeholder={t('descPlaceholder')}
          required
          value={state.description}
          onChange={(e) => {
            dispatch({ type: 'set', data: { description: e.target.value } })
          }}
        />
      </form>
      <div className="mt-[5px] text-right">
        <button
          className="btn red mr-[12px]"
          onClick={handleReset}
          type="reset"
        >
          {t('reset')}
        </button>
        <button
          type="submit"
          className="btn !bg-primary !text-white"
          onClick={handleSubmit}
        >
          {t('send')}
        </button>
      </div>
    </article>
  )
}
