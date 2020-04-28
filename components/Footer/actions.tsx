import { FC } from 'react'
import { BackTop } from 'antd'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faHeadphones } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'
import { useStore } from 'store'

export const FooterActions: FC = observer(() => {
  const { appStore, musicStore } = useStore()
  const { isOverflow } = appStore
  return (
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
    </div>
  )
})
