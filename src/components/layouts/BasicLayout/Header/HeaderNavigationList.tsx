import clsx from 'clsx'
import { FontIcon } from 'components/universal/FontIcon'
import { RootPortal } from 'components/universal/Portal'
import { TrackerAction } from 'constants/tracker'
import { useAnalyze } from 'hooks/use-analyze'
import { useHeaderNavList } from 'hooks/use-header-nav-list'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import { Transition } from 'react-transition-group'
import type { Menu } from 'types/config'

import { offset, shift, useFloating } from '@floating-ui/react-dom'

import styles from './index.module.css'

const transitionStyles = {
  entering: { opacity: 0, visibility: 'hidden', transform: 'translateY(10px)' },
  entered: { opacity: 1, visibility: 'visible', transform: 'translateY(0)' },
  exiting: { opacity: 1, visibility: 'visible', transform: 'translateY(0)' },
  exited: { opacity: 0, visibility: 'hidden', transform: 'translateY(10px)' },
}

const MenuLink: FC<{ menu: Menu; isPublicUrl: boolean }> = (props) => {
  const { menu, isPublicUrl } = props

  const { x, y, reference, floating, strategy, update } = useFloating({
    placement: 'bottom',
    strategy: 'fixed',
    middleware: [offset(10), shift()],
  })

  const [open, setOpen] = React.useState(false)

  const close = useCallback(() => setOpen(false), [])
  const popup = useCallback(() => {
    if (menu.subMenu) {
      update()
      setOpen(true)
    }
  }, [menu.subMenu, update])
  const { event } = useAnalyze()
  const tracker = useCallback((message) => {
    event({
      action: TrackerAction.Click,
      label: message,
    })
  }, [])
  return (
    <div className="relative" key={menu.title} onMouseLeave={close}>
      <Link href={menu.path}>
        <a
          onClick={() => tracker(`一级导航点击 - ${menu.title}`)}
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
                    {menu.subMenu?.map((m) => {
                      return (
                        <Link href={m.path} key={m.path}>
                          <a
                            onClick={() => tracker(`二级导航点击 - ${m.title}`)}
                          >
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
