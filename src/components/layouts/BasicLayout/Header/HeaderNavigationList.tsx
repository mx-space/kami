import { useFloating } from '@floating-ui/react-dom'
import clsx from 'clsx'
import { FontIcon } from 'components/universal/FontIcon'
import { RootPortal } from 'components/universal/Portal'
import { useHeaderNavList } from 'hooks/use-header-nav-list'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import React, { FC, useCallback } from 'react'
import { Transition } from 'react-transition-group'
import styles from './index.module.css'
const transitionStyles = {
  entering: { opacity: 0, visibility: 'hidden', transform: 'translateY(10px)' },
  entered: { opacity: 1, visibility: 'visible', transform: 'translateY(0)' },
  exiting: { opacity: 1, visibility: 'visible', transform: 'translateY(0)' },
  exited: { opacity: 0, visibility: 'hidden', transform: 'translateY(10px)' },
}

const MenuLink = (props: { menu: any; isPublicUrl: boolean }) => {
  const { menu, isPublicUrl } = props

  const { x, y, reference, floating, strategy, update } = useFloating({
    placement: 'bottom',
    strategy: 'fixed',
  })

  const [open, setOpen] = React.useState(false)

  const close = useCallback(() => setOpen(false), [])
  const popup = useCallback(() => {
    if (menu.subMenu) {
      update()
      setOpen(true)
    }
  }, [menu.subMenu, update])
  return (
    <div className="relative" key={menu.title} onMouseLeave={close}>
      <Link href={menu.path}>
        <a
          onMouseEnter={popup}
          ref={reference}
          rel={isPublicUrl ? 'noopener noreferrer' : undefined}
          target={isPublicUrl ? '_blank' : undefined}
        >
          <span className={styles['link-item']}>
            <FontIcon icon={menu.icon} />
            <span className={styles['link-title']}>{menu.title}</span>
          </span>
        </a>
      </Link>

      {menu.subMenu && (
        <RootPortal>
          <div
            ref={floating}
            className="z-20 w-[130px]"
            style={{ position: strategy, top: y ?? '', left: x ?? '' }}
          >
            <Transition in={open} appear mountOnEnter timeout={0}>
              {(state) => (
                <ul
                  className={clsx(styles['sub-dropdown'])}
                  style={{
                    opacity: 0,
                    visibility: 'hidden',
                    transform: 'translateY(10px)',
                    ...transitionStyles[state],
                  }}
                >
                  <div>
                    {menu.subMenu.map((m) => {
                      return (
                        <Link href={m.path} key={m.path}>
                          <a>
                            <li key={m.title}>
                              <FontIcon icon={m.icon} />
                              <span>{m.title}</span>
                            </li>
                          </a>
                        </Link>
                      )
                    })}
                  </div>
                </ul>
              )}
            </Transition>
          </div>
        </RootPortal>
      )}
    </div>
  )
}

export const HeaderNavigationList: FC = observer(() => {
  const { mergedMenu } = useHeaderNavList()
  return (
    <>
      {mergedMenu.map((_menu) => {
        const isPublicUrl = _menu.path.startsWith('http')
        return (
          <div className="relative" key={_menu.title}>
            <MenuLink isPublicUrl={isPublicUrl} menu={_menu}></MenuLink>
          </div>
        )
      })}
    </>
  )
})
