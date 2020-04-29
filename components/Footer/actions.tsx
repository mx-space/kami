import { faArrowUp, faHeadphones } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BackTop } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { FC } from 'react'
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
