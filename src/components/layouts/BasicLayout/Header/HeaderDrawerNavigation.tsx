import { FontIcon } from 'components/universal/FontIcon'
import { useHeaderNavList } from 'hooks/use-header-nav-list'
import Link from 'next/link'
import React, { memo } from 'react'

import styles from './index.module.css'

export const HeaderDrawerNavigation: React.FC = memo(() => {
  const { mergedMenu } = useHeaderNavList()
  return (
    <>
      {mergedMenu.map((m) => {
        return (
          <div key={m.title} className={styles['link-section']}>
            <Link href={m.path}>
              <a>
                <div className={styles['parent']}>
                  <FontIcon icon={m.icon} />
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
                          <FontIcon icon={m.icon} />
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
    </>
  )
})
