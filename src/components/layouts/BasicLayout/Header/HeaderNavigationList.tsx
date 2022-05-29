import clsx from 'clsx'
import { FloatPopover } from 'components/universal/FloatPopover'
import { FontIcon } from 'components/universal/FontIcon'
import { TrackerAction } from 'constants/tracker'
import { useAnalyze } from 'hooks/use-analyze'
import { useHeaderNavList } from 'hooks/use-header-nav-list'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import type { Menu } from 'types/config'

import styles from './index.module.css'

const MenuLink: FC<{ menu: Menu; isPublicUrl: boolean }> = (props) => {
  const { menu, isPublicUrl } = props

  const { event } = useAnalyze()
  const tracker = useCallback((message) => {
    event({
      action: TrackerAction.Click,
      label: message,
    })
  }, [])
  return (
    <div className="relative" key={menu.title}>
      <FloatPopover
        headless
        placement="bottom"
        offset={0}
        popoverWrapperClassNames={'z-19 relative'}
        triggerComponent={() => (
          <Link href={menu.path}>
            <a
              onClick={() => tracker(`一级导航点击 - ${menu.title}`)}
              rel={isPublicUrl ? 'noopener noreferrer' : undefined}
              target={isPublicUrl ? '_blank' : undefined}
            >
              <span className={styles['link-item']}>
                <FontIcon icon={menu.icon} />
                <span className={styles['link-title']}>{menu.title}</span>
              </span>
            </a>
          </Link>
        )}
      >
        {menu.subMenu?.length ? (
          <ul className={clsx(styles['sub-dropdown'])}>
            <div>
              {menu.subMenu?.map((m) => {
                return (
                  <Link href={m.path} key={m.path}>
                    <a onClick={() => tracker(`二级导航点击 - ${m.title}`)}>
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
        ) : null}
      </FloatPopover>
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
