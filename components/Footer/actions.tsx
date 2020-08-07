import { faArrowUp, faHeadphones } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BackTop } from 'antd'
import classNames from 'classnames'
import { useStore } from 'common/store'
import { QueueAnim } from 'components/Anime'
import { observer } from 'mobx-react'
import { FC } from 'react'

export const FooterActions: FC = observer(() => {
  const { /* userStore, */ appStore, actionStore, musicStore } = useStore()
  const { isOverflow } = appStore
  // const [chatShow, setChatShow] = useState(false)
  // const [newMessageCount, setCount] = useState(0)
  // useEffect(() => {
  //   const handler = (data: any) => {
  //     if (
  //       (!userStore.isLogged && data.author === userStore.name) ||
  //       data.author === userStore.username
  //     ) {
  //       setCount(newMessageCount + 1)
  //     }
  //   }
  //   observable.on(EventTypes.DANMAKU_CREATE, handler)

  //   return () => {
  //     observable.off(EventTypes.DANMAKU_CREATE, handler)
  //   }
  // }, [])
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
        <QueueAnim type="scale" leaveReverse ease="easeInQuart" forcedReplay>
          {actionStore.actions.map((action, i) => {
            return (
              <button key={i} onClick={action.onClick}>
                {action.icon}
              </button>
            )
          })}
        </QueueAnim>

        <button
          onClick={() => {
            musicStore.isHide = !musicStore.isHide
            musicStore.isHide ? null : musicStore.play()
          }}
        >
          <FontAwesomeIcon icon={faHeadphones} />
        </button>

        {/* <button>
          <FontAwesomeIcon icon={faHeart} />
        </button> */}

        {/* <button
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
        </button> */}
      </div>
      {/* <ConfigPanel /> */}
      {/* <ChatPanel show={chatShow} toggle={() => setChatShow(!chatShow)} /> */}
    </>
  )
})
