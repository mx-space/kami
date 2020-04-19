import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BackTop } from 'antd'
import classNames from 'classnames'
import Header from 'components/Header'
import { observer } from 'mobx-react'
import { useStore } from 'store'

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
