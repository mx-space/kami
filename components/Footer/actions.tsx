import {
  faArrowUp,
  faHeadphones,
  faHeart,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BackTop } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { FC, useState, useEffect } from 'react'
import { useStore } from 'store'
import { ChatPanel } from '../Panel'
import { usePrevious } from '../../hooks/usePrevious'

// import { createPortal } from 'react-dom'
// import { Panel } from '../Panel'
// const ConfigPanel: FC = () => {
//   const $root = document.documentElement
//   return createPortal(<Panel />, $root)
// }

export const FooterActions: FC = observer(() => {
  const { appStore, musicStore } = useStore()
  const { isOverflow } = appStore
  const [chatShow, setChatShow] = useState(false)
  const chatShowPrev = usePrevious(chatShow)
  return (
    <>
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
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
      {/* <ConfigPanel /> */}
      <ChatPanel show={chatShow} toggle={() => setChatShow(!chatShow)} />
    </>
  )
})
