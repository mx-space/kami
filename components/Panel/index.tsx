import { FC, forwardRef } from 'react'
import style from './index.module.scss'
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { Message } from './components/message'
import QueueAnim from 'rc-queue-anim'
const _ChatPanel: FC<any> = forwardRef((props, ref: any) => {
  return (
    <div className={style['wrapper']} ref={ref}>
      <div className={style['header']}>广播</div>
      <div className={style['container']}>
        <Message />
      </div>
      <div className={style['footer']}>
        <input type={'text'} className={style['text']} />
        <button className="btn yellow" disabled>
          发送 <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  )
})
export const ChatPanel: FC<{ show: boolean }> = (props) => {
  const show = props.show

  return ReactDOM.createPortal(
    <QueueAnim>{show ? <_ChatPanel key={'chat'} /> : null}</QueueAnim>,
    document.documentElement,
  )
}
