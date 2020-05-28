import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QueueAnim from 'rc-queue-anim'
import { FC, forwardRef } from 'react'
import ReactDOM from 'react-dom'
import { stopEventDefault } from '../../utils/dom'
import { Message } from './components/message'
import style from './index.module.scss'
const _ChatPanel: FC<any> = forwardRef((props, ref: any) => {
  return (
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
        <input
          type={'text'}
          className={style['text']}
          onContextMenu={(e) => e.stopPropagation()}
        />
        <button className="btn yellow" disabled>
          发送 <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
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
