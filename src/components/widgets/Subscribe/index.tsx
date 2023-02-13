import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { message } from 'react-message-popup'

import { Input, useModalStack } from '@mx-space/kami-design'
import { MdiEmailFastOutline } from '@mx-space/kami-design/components/Icons'

import { useStore } from '~/store'
import { apiClient } from '~/utils/client'
import { NoSSRWrapper } from '~/utils/no-ssr'

const Subscribe = observer(() => {
  const { subscribeStore } = useStore()

  const { present, disposeAll } = useModalStack()

  useEffect(() => {
    if (!subscribeStore.isHide) {
      present({
        modalProps: {
          title: '邮件订阅',
          closeable: true,
          useRootPortal: true,
          onClose: () => {
            subscribeStore.setHide(true)
          },
          noBlur: true,
        },
        overlayProps: {
          stopPropagation: true,
        },
        component: <SubscribeModal />,
      })
    }
  }, [present, subscribeStore, subscribeStore.isHide])

  const SubscribeModal = observer(() => {
    const { subscribeStore } = useStore()
    const handleSubList = async () => {
      if (!subscribeStore.email) {
        message.error('请输入邮箱')
        return
      }

      if (!subscribeStore.types.some((type) => type.checked)) {
        message.error('请选择订阅类型')
        return
      }
      await apiClient.proxy.subscribe.post({
        data: {
          email: subscribeStore.email,
          types: subscribeStore.allCheckedOptions,
        },
      })
      message.success('订阅成功')
      subscribeStore.reset()
      disposeAll()
    }
    return (
      <div>
        <form
          action="#"
          onSubmit={handleSubList}
          className="flex flex-col gap-5"
        >
          <Input
            type="text"
            placeholder="留下你的邮箱哦 *"
            required
            prefix={<MdiEmailFastOutline />}
            value={subscribeStore.email}
            onChange={(e) => {
              subscribeStore.setEmail(e.target.value)
            }}
          />
          <div className="flex gap-10">
            {subscribeStore.types.map(({ name, match, checked }, index) => (
              <fieldset
                className="inline-flex items-center children:cursor-pointer text-lg"
                key={name}
              >
                <input
                  type="checkbox"
                  onChange={() => {
                    subscribeStore.selectTypes(index)
                  }}
                  checked={checked}
                  id={name}
                />
                <label htmlFor={name} className="text-shizuku">
                  {match}
                </label>
              </fieldset>
            ))}
          </div>
          <button className="btn yellow">订阅</button>
        </form>
      </div>
    )
  })

  return null
})

export const SubscribeEmail = NoSSRWrapper(Subscribe)
