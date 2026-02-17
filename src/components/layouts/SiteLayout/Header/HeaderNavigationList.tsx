import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Link } from '~/i18n/navigation'
import type { FC } from 'react'
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Modifier, ShortcutContext } from 'react-shortcut-guide'

import { FloatPopover } from '~/components/ui/FloatPopover'
import { FontIcon } from '~/components/ui/FontIcon'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useHeaderNavList } from '~/hooks/app/use-header-nav-list'
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
      strategy="fixed"
      headless
      placement="bottom"
      offset={0}
      popoverWrapperClassNames="z-19 relative"
      triggerComponent={() => (
        <Link
          href={menu.path}
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
        </Link>
      )}
    >
      {menu.subMenu?.length ? (
        <ul className={clsx(styles['sub-dropdown'])}>
          {menu.subMenu?.map((m, i) => {
            return <Item m={m} i={i} key={m.path} />
          })}
        </ul>
      ) : null}
    </FloatPopover>
  )
}

const Item: FC<{ m: Menu; i: number }> = memo(({ m: menu, i }) => {
  const { event } = useAnalyze()
  const tracker = useCallback((message) => {
    event({
      action: TrackerAction.Click,
      label: message,
    })
  }, [])

  const [isHover, setIsHover] = useState(false)

  return (
    <>
      <Link
        href={menu.path}
        tabIndex={i + 10}
        role="button"
        onClick={() => tracker(`二级导航点击 - ${menu.title}`)}
        onFocus={() => {
          setIsHover(true)
        }}
        onBlur={() => {
          setIsHover(false)
        }}
      >
        <li
          key={menu.title}
          className="relative"
          onMouseEnter={() => {
            setIsHover(true)
          }}
          onMouseLeave={() => {
            setIsHover(false)
          }}
        >
          <FontIcon icon={menu.icon} />
          <span>{menu.title}</span>
          {isHover && (
            <motion.span
              className="bg-dark-50/10 dark:bg-light-50/10 absolute inset-0 z-0 rounded-lg"
              layoutId="menuItem"
              layout
            />
          )}
        </li>
      </Link>
    </>
  )
})

export const HeaderNavigationList: FC = memo(() => {
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
            <MenuLink isPublicUrl={isPublicUrl} menu={_menu} index={index} />
          </div>
        )
      })}
    </>
  )
})
