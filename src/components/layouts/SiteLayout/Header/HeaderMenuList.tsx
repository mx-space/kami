import type { FC } from 'react'

import { useRouter } from '~/i18n/navigation'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'

import { useKamiConfig } from '~/hooks/app/use-initial-data'

import { HeaderNavigationList } from './HeaderNavigationList'
import styles from './index.module.css'

export const MenuList: FC = memo(() => {
  const groupRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const kamiConfig = useKamiConfig()
  const ballIndex = useMemo(() => {
    const asPath = router.asPath
    const menu = kamiConfig.site.header.menu

    if (asPath === '' || asPath === '/') {
      const idx = menu.findIndex((item) => item.type == 'Home')

      return ~idx ? idx : -1
    }
    const firstPath = asPath.split('/')[1]

    const inMenuIndex = menu.findIndex(
      (item) =>
        item.path != '/' &&
        (asPath.startsWith(item.path) ||
          item.subMenu?.find((subItem) => asPath.startsWith(subItem.path))),
    )

    if (inMenuIndex > -1) {
      return inMenuIndex
    }
    switch (firstPath) {
      case 'category':
      case 'posts': {
        return menu.findIndex((item) => item.type == 'Post')
      }
      case 'notes': {
        return menu.findIndex((item) => item.type == 'Note')
      }
      case 'says': {
        return menu.findIndex((item) => item.path == '/says')
      }
      case 'timeline': {
        return menu.findIndex((item) => item.path.startsWith('/timeline'))
      }
      case 'friends': {
        return menu.findIndex((item) => item.path == '/friends')
      }
      case 'recently': {
        return menu.findIndex((item) => item.path.startsWith('/recently'))
      }

      default:
        return 0
    }
  }, [kamiConfig.site.header.menu, router.asPath])
  const [ballOffsetLeft, setBallOffsetLeft] = useState(0)
  useEffect(() => {
    if (!groupRef.current || typeof ballIndex === 'undefined') {
      return
    }

    const $group = groupRef.current
    const $child = $group.children.item(ballIndex) as HTMLElement

    if ($child) {
      setBallOffsetLeft(
        $child.offsetLeft + $child.getBoundingClientRect().width / 2,
      )
    }
  }, [ballIndex])

  return (
    <div className={styles['link-group']} ref={groupRef}>
      <HeaderNavigationList />

      {ballOffsetLeft ? (
        <div
          className={styles['anchor-ball']}
          style={{ left: `${ballOffsetLeft}px` }}
        />
      ) : null}
    </div>
  )
})
