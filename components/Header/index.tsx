/*
 * @Author: Innei
 * @Date: 2021-02-03 20:33:57
 * @LastEditTime: 2021-02-04 15:23:14
 * @LastEditors: Innei
 * @FilePath: /web/components/Header/index.tsx
 * @Mark: Coding with Love
 */
import { faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useDropdown } from 'common/context/dropdown'
import { useInitialData } from 'common/context/InitialDataContext'
import { useStore } from 'common/store'
import { LikeButton } from 'components/LikeButton'
import { CustomLogo as Logo } from 'components/Logo'
import { OverLay } from 'components/Overlay'
import { throttle } from 'lodash'
import { observer } from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {
  FC,
  Fragment,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { combineClassName, Rest } from 'utils'
import { message } from 'utils/message'
import css from './index.module.css'
import scss from './index.module.scss'
const styles = combineClassName(css, scss)

const HeaderActionButton: FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  return (
    <div
      className="flex items-center rounded-full px-3 bg-shallow cursor-pointer"
      {...props}
    ></div>
  )
}
const HeaderActionButtonsContainer = memo((props) => {
  return (
    <div
      className="absolute top-0 bottom-0 flex items-center"
      style={{ transform: 'translateX(calc(-100% - 20px))' }}
    >
      {props.children}
    </div>
  )
})

const HeaderActionLikeButtonForNote: FC<{ id: number }> = memo((props) => {
  const { id } = props
  const [liked, setLiked] = useState(false)
  const router = useRouter()
  useEffect(() => {
    setLiked(false)
  }, [router])
  const onLike = () =>
    Rest('Note')
      .get<any>('like/' + id, { withCredentials: true })
      .then(() => {
        message.success('感谢喜欢!')
        setLiked(true)
      })
      .catch(() => {
        setLiked(true)
      })

  return (
    <div onClick={onLike} className="flex items-center">
      <LikeButton checked={liked} />
      <span className="flex-shrink-0">喜欢</span>
    </div>
  )
})
const HeaderActionBasedOnRouterPath: FC = memo(() => {
  const router = useRouter()
  const asPath = router.asPath

  const firstPath = asPath.split('/')[1] || ''

  const Comp = (() => {
    switch (firstPath) {
      case 'notes': {
        const id = parseInt(router.query.id as any)

        if (id && typeof id === 'number') {
          return (
            <>
              <HeaderActionButtonsContainer>
                <HeaderActionButton style={{ height: '2.5rem', width: '5rem' }}>
                  <HeaderActionLikeButtonForNote id={id} />
                </HeaderActionButton>
              </HeaderActionButtonsContainer>
              <span>{id}</span>
            </>
          )
        }
        return null
      }
    }
    return null
  })()

  return <Fragment>{Comp}</Fragment>
})

const _HeaderDrawer: FC<{ show: boolean; onExit: () => void }> = memo(
  ({ children, onExit, show }) => {
    const router = useRouter()
    useEffect(() => {
      const handler = () => {
        onExit()
      }
      router.events.on('routeChangeStart', handler)

      return () => {
        router.events.off('routeChangeStart', handler)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])
    return createPortal(
      <Fragment>
        <OverLay show={show} onClose={onExit}></OverLay>
        <div
          className={classNames(styles['drawer'], show ? styles['show'] : null)}
          onClick={(e) => {
            console.log(e.target, (e.target as HTMLElement).tagName)
          }}
        >
          {children}
        </div>
      </Fragment>,
      document.body,
    )
  },
)

const HeaderDrawer = dynamic(() => Promise.resolve(_HeaderDrawer), {
  ssr: false,
})
export const _Header: FC = observer(() => {
  const {
    seo: { title },
  } = useInitialData()
  const router = useRouter()
  const { appStore, userStore } = useStore()

  const ballIndex = useMemo(() => {
    const asPath = router.asPath
    // console.log(asPath)

    if (asPath === '' || asPath === '/') {
      return 0
    }
    const firstPath = asPath.split('/')[1]
    // console.log(firstPath)

    switch (firstPath) {
      case 'posts': {
        return 1
      }
      case 'notes': {
        return 2
      }
      case 'says': {
        return 3
      }
      case 'timeline': {
        return 4
      }
      case 'friends': {
        return 5
      }
    }
  }, [router])

  // console.log(ballIndex)
  const groupRef = useRef<HTMLUListElement>(null)

  const ballOffsetLeft = useMemo(() => {
    if (!groupRef.current || typeof ballIndex === 'undefined') {
      return
    }
    const $group = groupRef.current
    const $child = $group.children
      .item(ballIndex)
      ?.children.item(0) as HTMLElement
    // console.log($child)

    return $child.offsetLeft + $child.getBoundingClientRect().width / 2
  }, [ballIndex, groupRef.current])
  const { present } = useDropdown()

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <header className={classNames(styles['header'], 'header-top-navbar')}>
      <nav
        className={classNames(
          styles['nav-container'],
          appStore.headerNav.show &&
            appStore.scrollDirection == 'down' &&
            appStore.isOverFirstScreenHalfHeight
            ? styles['toggle']
            : null,
        )}
      >
        <div className={classNames(styles['head-swiper'], 'justify-between')}>
          <div className={'flex items-center justify-center'}>
            <div
              className={styles['header-logo']}
              onClick={() => {
                appStore?.viewport.mobile ? router.push('/') : null
              }}
              onDoubleClick={() => {
                if (!userStore.isLogged) {
                  router.push('/login')
                }
              }}
            >
              <Logo />
            </div>
            <h1 className={styles['title']}>{title}</h1>
          </div>

          <div
            className={styles['more-button']}
            onClick={() => {
              setDrawerOpen(true)
            }}
          >
            <FontAwesomeIcon icon={faListUl} />
          </div>
          <ul className={styles['link-group']} ref={groupRef}>
            {appStore.menu.map((m) => {
              const isFontAwesomeIconDefine =
                m.icon && m.icon.icon && m.icon.prefix && m.icon.iconName

              const onMouseEnter = throttle(
                (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
                  if (!m.subMenu || !m.subMenu.length) {
                    return
                  }
                  const menu = m.subMenu!
                  const {
                    x,
                    y,
                    width,
                  } = (e.target as HTMLElement).getBoundingClientRect()
                  present(
                    <Fragment>
                      {menu.map((m) => {
                        return (
                          <Link href={m.path} key={m.path}>
                            <a>
                              <li>
                                {m.icon && <FontAwesomeIcon icon={m.icon} />}
                                <span>{m.title}</span>
                              </li>
                            </a>
                          </Link>
                        )
                      })}
                    </Fragment>,
                    {
                      x: x + width / 2 - 150 / 2,
                      y: y + 50,
                      width: 150,
                      id: m.title,
                      autoHideDuration: 5000,
                    },
                  )
                },
                50,
              )
              return (
                <Link href={m.path} key={m.title}>
                  <a onMouseEnter={onMouseEnter}>
                    <li className={styles['link-item']}>
                      {isFontAwesomeIconDefine && (
                        <FontAwesomeIcon icon={m.icon!} />
                      )}
                      <span className={styles['link-title']}>{m.title}</span>
                    </li>
                  </a>
                </Link>
              )
            })}

            {ballOffsetLeft && (
              <div
                className={styles['anchor-ball']}
                style={{ left: ballOffsetLeft + 'px' }}
              ></div>
            )}
          </ul>
        </div>
        <div
          className={classNames(
            styles['head-swiper'],
            styles['swiper-metawrapper'],
            'flex justify-between',
          )}
        >
          <div className={styles['head-info']}>
            <div className={styles['desc']}>
              <div className={styles['meta']}>{appStore.headerNav.meta}</div>
              <div className={styles['title']}>{appStore.headerNav.title}</div>
            </div>
          </div>
          <div className={styles['right-wrapper']}>
            <HeaderActionBasedOnRouterPath />
            <div className={styles['site-info']}>{title}</div>
          </div>
        </div>
      </nav>
      <HeaderDrawer
        show={drawerOpen}
        onExit={() => {
          setDrawerOpen(false)
        }}
      >
        {appStore.menu.map((m) => {
          return (
            <div key={m.title} className={styles['link-section']}>
              <Link href={m.path}>
                <a>
                  <div className={styles['parent']}>
                    {m.icon && <FontAwesomeIcon icon={m.icon} />}
                    <span>{m.title}</span>
                  </div>
                </a>
              </Link>
              <div className={styles['children-wrapper']}>
                {m.subMenu &&
                  m.subMenu.map((m) => {
                    return (
                      <Link href={m.path} key={m.title}>
                        <a>
                          <div className={styles['children']}>
                            {m.icon && <FontAwesomeIcon icon={m.icon} />}
                            <span>{m.title}</span>
                          </div>
                        </a>
                      </Link>
                    )
                  })}
              </div>
            </div>
          )
        })}
      </HeaderDrawer>
    </header>
  )
})

const Header = dynamic(() => Promise.resolve(_Header), { ssr: true })
export default Header
