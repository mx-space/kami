import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useCallback, useContext, useEffect } from 'react'
import { Modifier, ShortcutContext } from 'react-shortcut-guide'

import { FloatPopover } from '~/components/universal/FloatPopover'
import { FontIcon } from '~/components/universal/FontIcon'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useHeaderNavList } from '~/hooks/use-header-nav-list'
import type { Menu } from '~/types/config'

import styles from './index.module.css'

const MenuLink: FC<{ menu: Menu; isPublicUrl: boolean; index: number }> = (
  props,
) => {
  const { menu, isPublicUrl, index } = props

  const { event } = useAnalyze()
  const tracker = useCallback((message) => {
    event({
      action: TrackerAction.Click,
      label: message,
    })
  }, [])
  const { registerShortcut } = useContext(ShortcutContext)
  const id = `header-menu-${index}`
  useEffect(() => {
    if (index + 1 >= 10) {
      return
    }

    if (!menu.title) {
      return
    }
    const key = (index + 1).toString()
    return registerShortcut(
      key as any,
      [Modifier.None],
      () => {
        document.getElementById(id)?.click()
      },
      `前往 - ${menu.title}`,
    )
  }, [index, menu.path, menu.title, id])

  return (
    <FloatPopover
      strategy={'fixed'}
      headless
      placement="bottom"
      offset={0}
      popoverWrapperClassNames={'z-19 relative'}
      triggerComponent={() => (
        <Link href={menu.path}>
          <a
            id={id}
            tabIndex={-1}
            onClick={() => tracker(`一级导航点击 - ${menu.title}`)}
            rel={isPublicUrl ? 'noopener noreferrer' : undefined}
            target={isPublicUrl ? '_blank' : undefined}
          >
            <span className={styles['link-item']}>
              <FontIcon icon={menu.icon} />
              <span className={styles['link-title']}>{menu.title}</span>
              {!menu.title && <span className="sr-only">header icon</span>}
            </span>
          </a>
        </Link>
      )}
    >
      {menu.subMenu?.length ? (
        <ul className={clsx(styles['sub-dropdown'])}>
          {menu.subMenu?.map((m, i) => {
            return (
              <Link href={m.path} key={m.path} tabIndex={i + 10} role="button">
                <a
                  onClick={() => tracker(`二级导航点击 - ${m.title}`)}
                  tabIndex={i + 10}
                  role="button"
                >
                  <li key={m.title}>
                    <FontIcon icon={m.icon} />
                    <span>{m.title}</span>
                  </li>
                </a>
              </Link>
            )
          })}
        </ul>
      ) : null}
    </FloatPopover>
  )
}

export const HeaderNavigationList: FC = observer(() => {
  const { mergedMenu } = useHeaderNavList()
  return (
    <>
      {mergedMenu.map((_menu, index) => {
        const isPublicUrl = _menu.path.startsWith('http')
        return (
          <div
            className="relative"
            key={_menu.title}
            role="button"
            aria-label={_menu.title || 'header nav'}
          >
            <MenuLink
              isPublicUrl={isPublicUrl}
              menu={_menu}
              index={index}
            ></MenuLink>
          </div>
        )
      })}
    </>
  )
})
