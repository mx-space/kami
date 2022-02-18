import { BxBxPaperPlane } from 'components/universal/Icons'
import { RightLeftTransitionView } from 'components/universal/Transition/right-left'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { message } from 'react-message-popup'
import client from 'socket'
import { EventTypes } from 'types/events'
import { useStore } from '../../../store'
import { stopEventDefault } from '../../../utils/dom'
import { eventBus } from '../../../utils/event-emitter'
import { OwnerMessage } from './components/message'
// import { STORE_PREFIX } from './components/setting'
import style from './index.module.css'
const STORE_PREFIX = 'chat'

const _ChatPanel: FC<any> = observer(
  (props, ref: any) => {
    const [value, setValue] = useState('')
    // const [settingShow, setSettingShow] = useState(false)
    // const SettingRef = useRef<HTMLDivElement>(null)
    // const buttonRef = useRef<HTMLButtonElement>(null)
    // const [pos, setPos] = useState<{ x: number; y: number }>({} as any)
    const inputRef = useRef<HTMLInputElement>(null)
    const [isChineseInput, setComposition] = useState(false)

    const { gatewayStore, userStore } = useStore()
    useEffect(() => {
      inputRef.current?.focus()
    }, [])
    const [messages, setMessages] = useState<
      { text: string; id: number; date: Date }[]
    >([])
    useEffect(() => {
      const handler = (data) => {
        if (
          data.author === userStore.name ||
          data.author === userStore.username
        ) {
          const date = new Date()
          setMessages((messages) => [
            ...messages,
            {
              text: data.text,
              id: +date,
              date: date,
            },
          ])
        }
      }
      eventBus.on(EventTypes.DANMAKU_CREATE, handler)

      return () => {
        eventBus.off(EventTypes.COMMENT_CREATE, handler)
      }
    }, [])

    const handleSend = () => {
      const json = localStorage.getItem(STORE_PREFIX) as string

      const store = JSON.parse(json || '{}')
      if ((store.author || userStore.isLogged) && value.trim().length > 0) {
        setValue('')
        client
          .emit(EventTypes.DANMAKU_CREATE, {
            text: value,
            author: userStore.isLogged ? userStore.name : store.author,
            color: store.color || '#ffddff',
          })
          .then((errors) => {
            // console.log(errors)
            // if (errors.length > 0) {
            //   return
            // }
            // TODO
          })

        requestAnimationFrame(() => {
          const $contrainer = containerRef.current
          if ($contrainer) {
            const y = $contrainer.scrollHeight
            $contrainer.scrollTop = y
          }
        })
      } else {
        message.error('你还没有填写昵称/正文啦')
      }
    }
    const containerRef = useRef<HTMLDivElement>(null)

    return (
      <>
        <div
          className={style['wrapper']}
          ref={ref}
          id={'chat-panel'}
          onContextMenu={stopEventDefault}
        >
          <div className={style['header']}>广播</div>
          <div className={style['container']} ref={containerRef}>
            <OwnerMessage
              text={`${(() => {
                const hour = new Date().getHours()
                if (hour >= 3 && hour < 11) {
                  return 'おはよう'
                } else if (hour < 17) {
                  return 'こんにちは'
                } else if (hour < 24 || hour < 3) {
                  return 'こんばんは'
                }
              })()}~正在浏览本站的 ${gatewayStore.online} 个小伙伴${
                gatewayStore.online > 1 ? '们' : ''
              }, 你们好呀~ 这里是 ${userStore.name} ちゃん~`}
              date={new Date()}
            />
            {/* <OwnerMessage
              text={`在这里你可以发送弹幕, 并且广播给正在浏览本站的小伙伴, 点击左边的设置, 首先给自己起一个昵称吧`}
              date={new Date()}
            />
            <OwnerMessage
              text={`本站不会记录任何广播消息, 欢迎玩的开心呀!~`}
              date={new Date()}
            /> */}
            {messages.map(({ text, id, date }) => {
              return <OwnerMessage text={text} key={id} date={date} />
            })}
          </div>
          <div className="flex-shrink-0 pb-2">
            <div className={style['footer']}>
              <input
                type={'text'}
                className={style['text']}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                }}
                disabled={!userStore.isLogged}
                onCompositionStart={(e) => {
                  setComposition(true)
                }}
                onCompositionEnd={(e) => {
                  setComposition(false)
                }}
                onContextMenu={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isChineseInput) {
                    handleSend()
                  }
                }}
                ref={inputRef}
              />
              <button
                className="btn yellow"
                onClick={handleSend}
                disabled={!userStore.isLogged}
              >
                biu~~ <BxBxPaperPlane></BxBxPaperPlane>
              </button>
            </div>
          </div>
        </div>
      </>
    )
  },
  { forwardRef: true },
)
export const ChatPanel: FC<{ show: boolean; toggle: () => void }> = (props) => {
  const show = props.show

  return ReactDOM.createPortal(
    <RightLeftTransitionView
      timeout={{ exit: 500 }}
      in={show}
      unmountOnExit
      mountOnEnter
    >
      <_ChatPanel toggle={props.toggle} />
    </RightLeftTransitionView>,
    document.body,
  )
}
