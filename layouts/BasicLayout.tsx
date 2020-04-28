import { FooterActions } from 'components/Footer/actions'
import Header from 'components/Header'
import configs from 'configs'
import { observer } from 'mobx-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useStore } from 'store'

const APlayer = dynamic(() => import('components/Player'), {
  ssr: false,
})

export const BasicLayout = observer(({ children }) => {
  const { userStore } = useStore()

  return (
    <>
      <Header />
      {children}
      <footer>
        <style jsx>{`
          .row {
            padding-bottom: 18px;
          }
        `}</style>
        <div className="wrap">
          <div className="row">
            <div className="col-m-6 left to-center">
              <p>
                © {new Date().getFullYear()}{' '}
                <a href={configs.homePage ?? '#'} target="_blank">
                  {userStore.name}
                </a>
                .{' '}
                <span>
                  Design by <a href="//paul.ren">Paul.</a>{' '}
                </span>
                <span>
                  Dev by <a href="//innei.ren">Innei</a>.
                </span>
              </p>
            </div>
            <div className="col-m-6 right to-center">
              <p>
                <Link href="[page]" as="about">
                  <a>关于我</a>
                </Link>
                ·
                <a href="/feed" target="_blank">
                  订阅
                </a>
              </p>
            </div>
          </div>
        </div>
        <FooterActions />
      </footer>
      <APlayer />
    </>
  )
})
