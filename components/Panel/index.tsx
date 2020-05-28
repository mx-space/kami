import { faPaperPlane, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QueueAnim from 'rc-queue-anim'
import { FC, forwardRef, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { stopEventDefault } from '../../utils/dom'
import { Message } from './components/message'
import style from './index.module.scss'
import { createDangmaku } from '../../utils/dangmaku'
import { Setting, STORE_PREFIX } from './components/setting'
import { message } from 'antd'
const _ChatPanel: FC<any> = forwardRef((props, ref: any) => {
  const [value, setValue] = useState('')
  const [settingShow, setSettingShow] = useState(false)
  const SettingRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number }>({} as any)

  const handleSend = () => {
    const json = localStorage.getItem(STORE_PREFIX) as string

    const store = JSON.parse(json || '{}')
    if (store && store.color && store.author) {
      createDangmaku({ text: value, color: store.color })
      setValue('')
    } else {
      message.error('你还没有填写昵称啦')
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
          <Message />
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
            onContextMenu={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend()
              }
            }}
          />
          <button className="btn yellow" disabled>
            发送 <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
      <QueueAnim>
        {settingShow ? (
          <Setting
            key={'setting'}
            ref={SettingRef}
            style={{ top: pos.y - 210 + 'px', left: pos.x - 105 + 'px' }}
            setHide={() => {
              setSettingShow(false)
            }}
          />
        ) : null}
      </QueueAnim>
    </>
  )
})
export const ChatPanel: FC<{ show: boolean; toggle: () => void }> = (props) => {
  const show = props.show

  return ReactDOM.createPortal(
    <QueueAnim>
      {show ? <_ChatPanel key={'chat'} toggle={props.toggle} /> : null}
    </QueueAnim>,
    document.documentElement,
  )
}
