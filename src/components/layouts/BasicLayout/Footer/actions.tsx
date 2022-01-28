import {
  faArrowUp,
  faHeadphones,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { config, SpringValue } from '@react-spring/web'
import classNames from 'clsx'
import { ScaleTransitionView } from 'components/universal/Transition/scale'
import { ChatPanel } from 'components/widgets/Chat'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { FC, useEffect, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { useStore } from 'store'
import { EventTypes } from 'types/events'
import { eventBus } from 'utils'
import styles from './actions.module.css'

export const FooterActions: FC = observer(() => {
  const { userStore, appStore, actionStore, musicStore } = useStore()
  const { isOverFirstScreenHeight: isOverflow } = appStore
  const [chatShow, setChatShow] = useState(false)
  const [newMessageCount, setCount] = useState(0)
  useEffect(() => {
    const handler = (data: any) => {
      if (
        (!userStore.isLogged && data.author === userStore.name) ||
        data.author === userStore.username
      ) {
        setCount(newMessageCount + 1)
      }
    }
    eventBus.on(EventTypes.DANMAKU_CREATE, handler)

    return () => {
      eventBus.off(EventTypes.DANMAKU_CREATE, handler)
    }
  }, [])
  return (
    <>
      <div className="action">
        <button
          className={classNames('top', isOverflow ? 'active' : '')}
          onClick={(e) => {
            const currentScrollTop = document.documentElement.scrollTop

            e.preventDefault()

            const springValue = new SpringValue(currentScrollTop, {
              config: config.slow,

              onChange(v: any) {
                console.log(v)
                requestAnimationFrame(() => {
                  document.documentElement.scrollTop = v
                })
              },
            })

            springValue.key = '1'

            springValue.start(0)
          }}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <TransitionGroup>
          {actionStore.actions.map((action, i) => {
            return (
              <ScaleTransitionView
                key={i}
                unmountOnExit
                timeout={{ exit: 300 }}
              >
                <button onClick={action.onClick}>{action.icon}</button>
              </ScaleTransitionView>
            )
          })}
        </TransitionGroup>

        <button
          onClick={() => {
            runInAction(() => {
              musicStore.setHide(!musicStore.isHide)
              musicStore.setPlay(!musicStore.isHide)
            })
          }}
        >
          <FontAwesomeIcon icon={faHeadphones} />
        </button>

        <button
          onClick={(e) => {
            setChatShow(!chatShow)
            setCount(0)
          }}
          className={classNames(
            styles['message-btn'],
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
