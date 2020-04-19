import Header from 'components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'
import { useStore } from 'store'
import classNames from 'classnames'
import { BackTop } from 'antd'

export const BasicLayout = observer(({ children }) => {
  const { appStore } = useStore()
  const { isOverflow } = appStore
  return (
    <>
      <Header />
      {children}
      <footer>
        <div className="action">
          <BackTop>
            <button className={classNames('top', isOverflow ? 'active' : '')}>
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </BackTop>
        </div>
      </footer>
    </>
  )
})
