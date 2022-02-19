import { useFloating } from '@floating-ui/react-dom'
import clsx from 'clsx'
import { DropdownBase } from 'components/universal/Dropdown'
import { FontIcon } from 'components/universal/FontIcon'
import { useHeaderNavList } from 'hooks/use-header-nav-list'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import React, { FC } from 'react'
import styles from './index.module.css'

const MenuLink = (props: { menu: any; isPublicUrl: boolean }) => {
  const { menu, isPublicUrl } = props
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom',
    strategy: 'fixed',
  })

  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative" key={menu.title}>
      <Link href={menu.path}>
        <a
          onMouseEnter={() => {
            if (menu.subMenu) {
              setOpen(true)
            }
          }}
          onMouseLeave={() => setOpen(false)}
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
        <DropdownBase
          className={clsx(
            styles['sub-dropdown'],

            open && styles['active'],
          )}
          ref={floating}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
        >
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
        </DropdownBase>
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
