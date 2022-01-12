import classNames from 'clsx'
import { DropdownBase } from 'components/universal/Dropdown'
import { FontIcon } from 'components/universal/FontIcon'
import { useHeaderNavList } from 'hooks/use-header-nav-list'
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
          const isPublicUrl = m.path.startsWith('http')
          return (
            <div className="relative" key={m.title}>
              <Link href={m.path}>
                <a
                  rel={isPublicUrl ? 'noopener noreferrer' : undefined}
                  target={isPublicUrl ? '_blank' : undefined}
                >
                  <span
                    className={styles['link-item']}
                    onMouseEnter={useCallback(() => {
                      menu.selection = selection
                    }, [selection])}
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
