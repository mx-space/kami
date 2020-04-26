import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BackTop } from 'antd'
import classNames from 'classnames'
import Header from 'components/Header'
import { observer } from 'mobx-react'
import { useStore } from 'store'
import configs from 'configs'
import Link from 'next/link'

export const BasicLayout = observer(({ children }) => {
  const { appStore, userStore } = useStore()
  const { isOverflow } = appStore
  return (
    <>
      <Header />
      {children}
      <footer>
        <div className="wrap">
          <div className="row">
            <div className="col-m-6 left to-center">
              <p>
                © {new Date().getFullYear()}{' '}
                <a href={configs.homePage ?? '#'} target="_blank">
                  {userStore.name}
                </a>
                .
              </p>
            </div>
            <div className="col-m-6 right to-center">
              <p>
                <Link href="[page]" as="about">
                  <a>关于我</a>
                </Link>
                ·
                <a href="//feed" target="_blank">
                  订阅
                </a>
              </p>
            </div>
          </div>
        </div>
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
