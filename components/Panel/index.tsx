import { faCog, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { message } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { FC, forwardRef, useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import client from 'common/socket'
import { EventTypes } from 'common/socket/types'
import { stopEventDefault } from '../../utils/dom'
import { OwnerMessage } from './components/message'
import { Setting, STORE_PREFIX } from './components/setting'
import style from './index.module.scss'
import { observer } from 'mobx-react'
import { useStore } from '../../common/store'
import observable from '../../utils/observable'

const _ChatPanel: FC<any> = observer(
  forwardRef((props, ref: any) => {
    const [value, setValue] = useState('')
    const [settingShow, setSettingShow] = useState(false)
    const SettingRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [pos, setPos] = useState<{ x: number; y: number }>({} as any)
    const inputRef = useRef<HTMLInputElement>(null)
    const [isChineseInput, setComposition] = useState(false)

    const { gatewayStore, userStore } = useStore()
    useEffect(() => {
      inputRef.current?.focus()
    }, [])
    const [messages, setMessages] = useState<{ text: string; id: number }[]>([])
    useEffect(() => {
      const handler = (data) => {
        if (
          data.author === userStore.name ||
          data.author === userStore.username
        ) {
          setMessages((messages) => [
            ...messages,
            {
              text: data.text,
              id: new Date().getTime(),
            },
          ])
        }
      }
      observable.on(EventTypes.DANMAKU_CREATE, handler)

      return () => {
        observable.off(EventTypes.COMMENT_CREATE, handler)
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
            color: store.color || '#2CCCE4',
          })
          .then((errors) => {
            // console.log(errors)
            // if (errors.length > 0) {
            //   return
            // }
            // TODO
          })
      } else {
        message.error('你还没有填写昵称/正文啦')
      }
    }

    return (
      <>
        <div
          className={style['wrapper']}
          ref={ref}
          id={'chat-panel'}
          onContextMenu={stopEventDefault}
        >
          <div className={style['header']}>广播</div>
          <div className={style['container']}>
            <OwnerMessage
              text={`Hi~正在浏览本站的${gatewayStore.online}个小伙伴${
                gatewayStore.online > 1 ? '们' : ''
              }, 你们好呀~ 这里是 ${userStore.name} 嗒~`}
              date={new Date()}
            />
            <OwnerMessage
              text={`在这里你可以发送弹幕, 并且广播给正在浏览本站的小伙伴, 点击左边的设置, 首先给自己起一个昵称吧`}
              date={new Date()}
            />
            <OwnerMessage
              text={`本站不会记录任何广播消息, 欢迎玩的开心呀!~`}
              date={new Date()}
            />
            {messages.map(({ text, id }) => {
              return <OwnerMessage text={text} key={id} date={new Date()} />
            })}
          </div>
          <div className={style['footer']}>
            <button
              className={'btn blue'}
              style={{ padding: '2px 4px' }}
              onClick={(e) => {
                setSettingShow(!settingShow)
                try {
                  const rect = buttonRef.current!.getBoundingClientRect()
                  setPos({
                    x: rect?.x,
                    y: rect?.y,
                  })
                  // eslint-disable-next-line no-empty
                } catch {}
              }}
              ref={buttonRef}
            >
              <FontAwesomeIcon icon={faCog} />
            </button>
            <input
              type={'text'}
              className={style['text']}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
              }}
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
            <button className="btn yellow" onClick={handleSend}>
              biu~~ <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
        <QueueAnim>
          {settingShow ? (
            <Setting
              key={'setting'}
              ref={SettingRef}
              style={{ top: pos.y - 210 + 'px', left: pos.x - 60 + 'px' }}
              setHide={() => {
                setSettingShow(false)
              }}
            />
          ) : null}
        </QueueAnim>
      </>
    )
  }),
)
export const ChatPanel: FC<{ show: boolean; toggle: () => void }> = (props) => {
  const show = props.show

  return ReactDOM.createPortal(
    <QueueAnim>
      {show ? <_ChatPanel key={'chat'} toggle={props.toggle} /> : null}
    </QueueAnim>,
    document.body,
  )
}
