import classNames from 'clsx'
import { useHeaderNavList } from 'common/hooks/use-header-nav-list'
import { DropdownBase } from 'components/Dropdown'
import { FontIcon } from 'components/FontIcon'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import React, { FC, useCallback } from 'react'
import { menu } from './HeaderMenuList'
import styles from './index.module.css'

export const HeaderNavigationList: FC<{ showSub: boolean }> = observer(
  ({ showSub }) => {
    const { mergedMenu } = useHeaderNavList()

    return (
      <>
        {mergedMenu.map((m, selection) => {
          return (
            <div className="relative" key={m.title}>
              <Link href={m.path}>
                <a
                  {...(m.path.startsWith('http')
                    ? { rel: 'noreferrer', target: '_blank' }
                    : {})}
                >
                  <span
                    className={styles['link-item']}
                    onMouseEnter={useCallback(() => {
                      menu.selection = selection
                    }, [])}
                    onMouseLeave={useCallback(() => {
                      menu.selection = null
                    }, [])}
                  >
                    <FontIcon icon={m.icon} />
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
                            <FontIcon icon={m.icon} />
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
      </>
    )
  },
)
