/**
 * 申请友链的表单
 */
import type { FC } from 'react'
import { useCallback, useReducer } from 'react'
import { message } from 'react-message-popup'

import {
  MdiEmailFastOutline,
  MdiFountainPenTip,
  PhUser,
  RadixIconsAvatar,
  SiGlyphGlobal,
} from '~/components/universal/Icons'
import { apiClient } from '~/utils/client'

import { Input } from '../../universal/Input'
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
  const [state, dispatch] = useFormData()
  const handleSubmit = useCallback(() => {
    const { author, avatar, description: desc, email, url, name } = state
    if (!author) {
      message.error('请填写昵称')
      return
    }
    if (!avatar) {
      message.error('请填写头像')
      return
    }
    if (!desc) {
      message.error('请填写简介')
      return
    }
    if (!email) {
      message.error('请填写邮箱')
      return
    }
    if (!url) {
      message.error('请填写网址')
      return
    }
    if (!name) {
      message.error('请填写网站名称')
      return
    }

    apiClient.link.applyLink({ ...state }).then(() => {
      dispatch({ type: 'reset' })
    })
  }, [state])

  const handleReset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [])
  return (
    <article className={styles.wrap}>
      <h1>我想和你交朋友！</h1>
      <form action="#" onSubmit={handleSubmit}>
        <Input
          placeholder={'昵称 *'}
          required
          prefix={<PhUser />}
          value={state.author}
          onChange={(e) => {
            dispatch({ type: 'set', data: { author: e.target.value } })
          }}
        />
        <Input
          placeholder={'站点标题 *'}
          required
          prefix={<MdiFountainPenTip />}
          value={state.name}
          onChange={(e) => {
            dispatch({ type: 'set', data: { name: e.target.value } })
          }}
        />
        <Input
          placeholder={'网站 * https://'}
          required
          prefix={<SiGlyphGlobal />}
          value={state.url}
          onChange={(e) => {
            dispatch({ type: 'set', data: { url: e.target.value } })
          }}
        />
        <Input
          placeholder={'头像链接 * https://'}
          required
          prefix={<RadixIconsAvatar />}
          value={state.avatar}
          onChange={(e) => {
            dispatch({ type: 'set', data: { avatar: e.target.value } })
          }}
        />
        <Input
          placeholder={'留下你的邮箱哦 *'}
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
          placeholder={'描述 *'}
          required
          value={state.description}
          onChange={(e) => {
            dispatch({ type: 'set', data: { description: e.target.value } })
          }}
        />
      </form>
      <div className={'text-right mt-[5px]'}>
        <button
          className="btn red mr-[12px]"
          onClick={handleReset}
          type="reset"
        >
          重置
        </button>
        <button type="submit" className="btn yellow" onClick={handleSubmit}>
          发送
        </button>
      </div>
    </article>
  )
}
