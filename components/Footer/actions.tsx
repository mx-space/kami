import {
  faArrowUp,
  faHeadphones,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BackTop } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { FC, useEffect, useState } from 'react'
import { useStore } from 'store'
import { EventTypes } from '../../socket/types'
import observable from '../../utils/observable'
import { ChatPanel } from '../Panel'

export const FooterActions: FC = observer(() => {
  const { userStore, appStore, musicStore } = useStore()
  const { isOverflow } = appStore
  const [chatShow, setChatShow] = useState(false)
  const [newMessageCount, setCount] = useState(0)
  useEffect(() => {
    const handler = () => {
      if (!userStore.isLogged) {
        setCount(newMessageCount + 1)
      }
    }
    observable.on(EventTypes.DANMAKU_CREATE, handler)

    return () => {
      observable.off(EventTypes.DANMAKU_CREATE, handler)
    }
  }, [])
  return (
    <>
      <style jsx>
        {`
          .message-btn {
            position: relative;
          }
          .message-btn.count::before {
            content: attr(data-count);
            position: absolute;
            right: 0;
            top: 0;
            height: 1rem;
            width: 1rem;
            background: var(--red);
            border-radius: 50%;
            font-size: 0.8rem;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            animation: fade-small-large 0.5s both;
          }
        `}
      </style>
      <div className="action">
        <BackTop>
          <button className={classNames('top', isOverflow ? 'active' : '')}>
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </BackTop>
        <button
          onClick={(e) => {
            musicStore.isHide = !musicStore.isHide
            musicStore.isHide ? null : musicStore.play()
          }}
        >
          <FontAwesomeIcon icon={faHeadphones} />
        </button>
        {/* <button>
          <FontAwesomeIcon icon={faHeart} />
        </button> */}

        <button
          onClick={(e) => {
            setChatShow(!chatShow)
            setCount(0)
          }}
          className={classNames(
            'message-btn',
            newMessageCount ? 'count' : null,
          )}
          data-count={newMessageCount}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
      {/* <ConfigPanel /> */}
      <ChatPanel show={chatShow} toggle={() => setChatShow(!chatShow)} />
    </>
  )
})
