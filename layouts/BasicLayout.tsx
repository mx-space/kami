import Header from 'components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'
import { useStore } from 'store'
import classNames from 'classnames'

export const BasicLayout = observer(({ children }) => {
  const { appStore } = useStore()
  const { isOverflow } = appStore
  return (
    <>
      <Header />
      {children}
      <footer>
        <div className="action">
          <button
            className={classNames('top', isOverflow ? 'active' : '')}
            onClick={() =>
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            }
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </footer>
    </>
  )
})
