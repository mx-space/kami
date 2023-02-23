import { observer } from 'mobx-react-lite'
import { useEffect, useReducer } from 'react'
import { message } from 'react-message-popup'

import { SubscribeTypeToBitMap } from '@mx-space/api-client'
import { Input, useStateToRef } from '@mx-space/kami-design'
import { MdiEmailFastOutline } from '@mx-space/kami-design/components/Icons'

import { useInitialData } from '~/hooks/use-initial-data'
import { apiClient } from '~/utils/client'

import { useSubscribeStatus } from './hooks'

interface SubscribeModalProps {
  onConfirm: () => void
  defaultTypes?: (keyof typeof SubscribeTypeToBitMap)[]
}

const subscibeTextMap: Record<string, string> = {
  post_c: '文章',
  note_c: '生活点滴',
  say_c: '说说',
  recently_c: '速记',
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

export const SubscribeModal = observer<SubscribeModalProps>(
  ({ onConfirm, defaultTypes }) => {
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

    const query = useSubscribeStatus()

    const handleSubList = async () => {
      if (!state.email) {
        message.error('请输入邮箱')
        return
      }
      if (Object.values(state.types).every((type) => !type)) {
        message.error('请选择订阅类型')
        return
      }
      const { email, types } = state
      await apiClient.subscribe.subscribe(
        email,
        Object.keys(types).filter((name) => state.types[name]) as any[],
      )

      message.success('订阅成功')
      dispatch({ type: 'reset' })
      onConfirm()
    }
    const {
      seo: { title },
    } = useInitialData()
    return (
      <form action="#" onSubmit={handleSubList} className="flex flex-col gap-5">
        <p className="text-gray-1 text-sm">
          欢迎订阅「{title}
          」，我会定期推送最新的内容到你的邮箱。
        </p>
        <Input
          type="text"
          placeholder="留下你的邮箱哦 *"
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
                className="inline-flex items-center children:cursor-pointer text-lg"
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
          或者你也可以通过{' '}
          <a href="/feed" className="text-green" target={'_blank'}>
            /feed
          </a>{' '}
          订阅「{title}」的 RSS 流。
        </p>
        <button className="btn green" disabled={!state.email}>
          订阅
        </button>
      </form>
    )
  },
)
