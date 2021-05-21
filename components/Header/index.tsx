/*
 * @Author: Innei
 * @Date: 2021-02-03 20:33:57
 * @LastEditTime: 2021-05-21 21:10:51
 * @LastEditors: Innei
 * @FilePath: /web/components/Header/index.tsx
 * @Mark: Coding with Love
 */
import {
  faListUl,
  faShare,
  faTimes,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useInitialData } from 'common/context/InitialDataContext'
import { appUIStore, useStore } from 'common/store'
import { DropdownBase } from 'components/Dropdown'
import { LikeButton } from 'components/LikeButton'
import { CustomLogo as Logo } from 'components/Logo'
import { OverLay } from 'components/Overlay'
import { makeAutoObservable } from 'mobx'
import { Observer, observer } from 'mobx-react-lite'
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
import { combineClassName, isLikedBefore, NoSSR, Rest, setLikeId } from 'utils'
import { message } from 'utils/message'
import observable from 'utils/observable'
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
  return <div className="mr-3 flex items-center">{props.children}</div>
})

const HeaderActionLikeButtonForNote: FC<{ id: number }> = memo((props) => {
  const { id } = props
  const [liked, setLiked] = useState(false)
  const router = useRouter()
  useEffect(() => {
    setLiked(false)
  }, [router])
  useEffect(() => {
    setLiked(isLikedBefore(id.toString()))

    const handler = (nid) => {
      if (id === nid) {
        setLiked(true)
      }
    }
    observable.on('like', handler)

    return () => {
      observable.off('like', handler)
    }
  }, [id])
  const onLike = () =>
    Rest('Note')
      .get<any>('like/' + id, {
        params: {
          ts: performance.timeOrigin + performance.now(),
        },
      })
      .then(() => {
        message.success('感谢喜欢!')
        observable.emit('like', id)
        setLikeId(id.toString())
        // setLiked(true)
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

const HeaderActionButtonWithIcon: FC<{
  icon: IconDefinition
  title: string
  onClick: () => void
}> = memo(({ icon, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center text-shizuku-text text-opacity-95"
    >
      <FontAwesomeIcon icon={icon} className={'mr-2'} />

      <span className="flex-shrink-0">{title}</span>
    </div>
  )
})
const HeaderActionShareButton: FC = observer(() => {
  const hasShare = 'share' in navigator
  return hasShare && appUIStore.shareData ? (
    <HeaderActionButtonsContainer>
      <HeaderActionButton style={{ height: '2.5rem', width: '5rem' }}>
        <HeaderActionButtonWithIcon
          onClick={() => {
            navigator
              .share(appUIStore.shareData!)
              .then(() => {})
              .catch(() => {})
          }}
          icon={faShare}
          title={'分享'}
        />
      </HeaderActionButton>
    </HeaderActionButtonsContainer>
  ) : null
})
const HeaderActionBasedOnRouterPath: FC = memo(() => {
  const router = useRouter()
  const pathname = router.pathname
  const {
    seo: { title },
  } = useInitialData()

  const Comp = (() => {
    const titleComp = <div className={styles['site-info']}>{title}</div>
    switch (pathname) {
      case '/notes/[id]': {
        const id = parseInt(router.query.id as any)

        if (id && typeof id === 'number') {
          return (
            <>
              <HeaderActionButtonsContainer>
                <HeaderActionButton style={{ height: '2.5rem', width: '5rem' }}>
                  <HeaderActionLikeButtonForNote id={id} />
                </HeaderActionButton>
              </HeaderActionButtonsContainer>
              <div className="flex flex-col flex-shrink-0">
                <span>{id}</span>
                {titleComp}
              </div>
            </>
          )
        }
        return null
      }

      case '/[page]': {
        return (
          <Fragment>
            <HeaderActionShareButton />
            <div className="flex flex-col flex-shrink-0">
              <span>/{router.query.page}</span>
              {titleComp}
            </div>
          </Fragment>
        )
      }
      default: {
        return (
          <Fragment>
            <HeaderActionShareButton />
            {titleComp}
          </Fragment>
        )
      }
    }
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
        >
          <div className="pb-4 text-right">
            <span className={'p-4 inline-block -mr-5 -mt-4'} onClick={onExit}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>

          {children}
        </div>
      </Fragment>,
      document.body,
    )
  },
)

const HeaderDrawer = NoSSR(_HeaderDrawer)
class Menu {
  constructor() {
    makeAutoObservable(this)
  }
  selection: number | null = null
}
const menu = new Menu()

const MenuList: FC<{ showSub?: boolean }> = memo(({ showSub }) => {
  const { appStore } = useStore()
  const groupRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const ballIndex = useMemo(() => {
    const asPath = router.asPath
    // console.log(asPath)

    if (asPath === '' || asPath === '/') {
      return 0
    }
    const firstPath = asPath.split('/')[1]
    // console.log(firstPath)

    switch (firstPath) {
      case 'category':
      case 'login':
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
      case 'recently': {
        return 6
      }
      case 'projects':
      case 'favorite': {
        return 7
      }
    }
  }, [router])
  const [ballOffsetLeft, setBallOffsetLeft] = useState(0)
  useEffect(() => {
    if (!groupRef.current || typeof ballIndex === 'undefined') {
      return
    }
    const $group = groupRef.current
    const $child = $group.children.item(ballIndex) as HTMLElement

    // console.log($child)

    setBallOffsetLeft(
      $child.offsetLeft + $child.getBoundingClientRect().width / 2,
    )
  }, [ballIndex])

  // console.log(ballOffsetLeft, ballIndex)
  return (
    <div className={styles['link-group']} ref={groupRef}>
      <Observer>
        {() => (
          <Fragment>
            {appStore.menu.map((m, selection) => {
              const isFontAwesomeIconDefine =
                m.icon && m.icon.icon && m.icon.prefix && m.icon.iconName

              return (
                <div className="relative" key={m.title}>
                  <Link href={m.path}>
                    <a>
                      <span
                        className={styles['link-item']}
                        onMouseEnter={() => {
                          menu.selection = selection
                        }}
                        onMouseLeave={() => {
                          menu.selection = null
                        }}
                      >
                        {isFontAwesomeIconDefine && (
                          <FontAwesomeIcon icon={m.icon!} />
                        )}
                        <span className={styles['link-title']}>{m.title}</span>
                      </span>
                    </a>
                  </Link>
                  {showSub && m.subMenu && (
                    <DropdownBase
                      className={classNames(
                        styles['sub-dropdown'],
                        selection === menu.selection ? styles['active'] : null,
                      )}
                    >
                      {m.subMenu.map((m) => {
                        return (
                          <Link href={m.path} key={m.path}>
                            <a>
                              <li key={m.title}>
                                {m.icon && <FontAwesomeIcon icon={m.icon} />}
                                <span>{m.title}</span>
                              </li>
                            </a>
                          </Link>
                        )
                      })}
                    </DropdownBase>
                  )}
                </div>
              )
            })}
          </Fragment>
        )}
      </Observer>

      {ballOffsetLeft ? (
        <div
          className={styles['anchor-ball']}
          style={{ left: ballOffsetLeft + 'px' }}
        ></div>
      ) : null}
    </div>
  )
})
const HeaderFake: FC = observer(() => {
  return (
    <header
      className={classNames(
        styles['header'],
        'header-top-navbar overflow-visible',
        styles['fake-header'],
      )}
    >
      <nav
        className={classNames(
          styles['nav-container'],
          styles['nav-fake'],
          'justify-end flex',
        )}
      >
        <MenuList showSub />
      </nav>
    </header>
  )
})
export const _Header: FC = observer(() => {
  const {
    seo: { title },
  } = useInitialData()
  const { appStore, userStore } = useStore()

  // console.log(ballIndex)
  const router = useRouter()
  // const { present, wantToDisposer } = useDropdown()

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header
        className={classNames(
          styles['header'],
          'header-top-navbar',
          !appStore.headerNav.show &&
            appStore.isOverFirstScreenHeight &&
            appStore.viewport.mobile
            ? styles['hide']
            : null,
        )}
      >
        <nav
          className={classNames(
            styles['nav-container'],
            appStore.headerNav.show &&
              (appStore.scrollDirection == 'down' ||
                appStore.viewport.mobile) &&
              appStore.isOverPostTitleHeight
              ? styles['toggle']
              : null,
          )}
        >
          <div className={classNames(styles['head-swiper'], 'justify-between')}>
            <div
              className={
                'flex items-center justify-center cursor-pointer select-none'
              }
              onClick={() => {
                router.push('/')
              }}
            >
              <div
                className={styles['header-logo']}
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
            <MenuList />
          </div>
          <div
            className={classNames(
              styles['head-swiper'],
              styles['swiper-metawrapper'],
              'flex justify-between truncate',
            )}
          >
            <div className={styles['head-info']}>
              <div className={styles['desc']}>
                <div className={styles['meta']}>{appStore.headerNav.meta}</div>
                <div className={styles['title']}>
                  {appStore.headerNav.title}
                </div>
              </div>
            </div>
            <div className={styles['right-wrapper']}>
              <HeaderActionBasedOnRouterPath />
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
      <HeaderFake />
    </>
  )
})

const Header = dynamic(() => Promise.resolve(_Header), { ssr: false })
export default Header
