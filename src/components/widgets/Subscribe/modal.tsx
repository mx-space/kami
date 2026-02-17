import type { FC } from 'react'
import { useEffect, useReducer } from 'react'
import { useTranslations } from 'next-intl'
import { message } from 'react-message-popup'
import { useStateToRef } from 'react-shortcut-guide'

import type { SubscribeTypeToBitMap } from '@mx-space/api-client'

import { MdiEmailFastOutline } from '~/components/ui/Icons/for-comment'
import { Input } from '~/components/ui/Input'
import { useInitialData } from '~/hooks/app/use-initial-data'
import { apiClient } from '~/utils/client'

import { useSubscribeStatusQuery } from './hooks'

interface SubscribeModalProps {
  onConfirm: () => void
  defaultTypes?: (keyof typeof SubscribeTypeToBitMap)[]
}


const initialState = {
  email: '',
  types: {
    post_c: false,
    note_c: false,
    say_c: false,
    recently_c: false,
  },
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

export const SubscribeModal: FC<SubscribeModalProps> = ({
  onConfirm,
  defaultTypes,
}) => {
  const t = useTranslations('subscribe')
  const [state, dispatch] = useFormData()

  const stateRef = useStateToRef(state)

  useEffect(() => {
    if (!defaultTypes || !defaultTypes.length) {
      return
    }

    dispatch({
      type: 'set',
      data: {
        types: defaultTypes.reduce(
          (acc, type) => {
            acc[type] = true
            return acc
          },
          { ...stateRef.current.types },
        ),
      },
    })
  }, [])

  const query = useSubscribeStatusQuery()

  const handleSubList = async () => {
    if (!state.email) {
      message.error(t('emailRequired'))
      return
    }
    if (Object.values(state.types).every((type) => !type)) {
      message.error(t('typeRequired'))
      return
    }
    const { email, types } = state
    await apiClient.subscribe.subscribe(
      email,
      Object.keys(types).filter((name) => state.types[name]) as any[],
    )

    message.success(t('success'))
    dispatch({ type: 'reset' })
    onConfirm()
  }
  const {
    seo: { title },
  } = useInitialData()
  const subscibeTextMap: Record<string, string> = {
    post_c: t('post'),
    note_c: t('note'),
    say_c: t('say'),
    recently_c: t('recently'),
  }
  return (
    <form
      action="#"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubList()
      }}
      className="flex flex-col gap-5"
    >
      <p className="text-gray-1 text-sm">{t('welcome', { title })}</p>
      <Input
        type="text"
        placeholder={t('emailPlaceholder')}
        required
        prefix={<MdiEmailFastOutline />}
        value={state.email}
        onChange={(e) => {
          dispatch({ type: 'set', data: { email: e.target.value } })
        }}
      />
      <div className="flex gap-10">
        {Object.keys(state.types)
          .filter((type) => query.data?.allowTypes.includes(type as any))
          .map((name) => (
            <fieldset
              className="children:cursor-pointer inline-flex items-center text-lg"
              key={name}
            >
              <input
                type="checkbox"
                onChange={(e) => {
                  dispatch({
                    type: 'set',
                    data: {
                      types: {
                        ...state.types,
                        [name]: e.target.checked,
                      },
                    },
                  })
                }}
                checked={state.types[name]}
                id={name}
              />
              <label htmlFor={name} className="text-shizuku">
                {subscibeTextMap[name]}
              </label>
            </fieldset>
          ))}
      </div>

      <p className="text-gray-1 -mt-2 text-sm">
        {t('orRss')}{' '}
        <a href="/feed" className="text-green" target="_blank">
          /feed
        </a>{' '}
        {t('rssSubscribe', { title })}
      </p>
      <button className="btn" disabled={!state.email}>
        {t('subscribe')}
      </button>
    </form>
  )
}
