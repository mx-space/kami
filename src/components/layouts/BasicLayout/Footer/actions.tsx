import { MaidianAction } from 'constants/maidian'
import classNames from 'clsx'
import {
  BxBxsArrowToTop,
  FaSolidHeadphonesAlt,
} from 'components/universal/Icons'
import { ScaleTransitionView } from 'components/universal/Transition/scale'
import { useAnalyze } from 'hooks/use-analyze'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { FC, useEffect, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { useStore } from 'store'
import { EventTypes } from 'types/events'
import { eventBus } from 'utils'
import { springScrollToTop } from 'utils/spring'
// TODO chat panel
export const FooterActions: FC = observer(() => {
  const { userStore, appStore, actionStore, musicStore } = useStore()
  const { isOverFirstScreenHeight: isOverflow } = appStore
  // const [chatShow, setChatShow] = useState(false)
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

  const { event } = useAnalyze()
  return (
    <>
      <div className="action">
        <button
          className={classNames('top', isOverflow ? 'active' : '')}
          onClick={springScrollToTop}
        >
          <BxBxsArrowToTop />
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
            event({
              action: MaidianAction.FooterPlayerClick,
            })
            runInAction(() => {
              musicStore.setHide(!musicStore.isHide)
              musicStore.setPlay(!musicStore.isHide)
            })
          }}
        >
          <FaSolidHeadphonesAlt />
        </button>

        {/* <button
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
        </button> */}
      </div>
      {/* <ConfigPanel /> */}
      {/* <ChatPanel show={chatShow} toggle={() => setChatShow(!chatShow)} /> */}
    </>
  )
})
