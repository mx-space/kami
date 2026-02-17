import { Link } from '~/i18n/navigation'
import React, { memo, useCallback } from 'react'

import { FontIcon } from '~/components/ui/FontIcon'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useHeaderNavList } from '~/hooks/app/use-header-nav-list'

import styles from './index.module.css'

export const HeaderDrawerNavigation: React.FC = memo(() => {
  const { mergedMenu } = useHeaderNavList()
  const { event } = useAnalyze()
  const tracker = useCallback((message) => {
    event({
      action: TrackerAction.Click,
      label: message,
    })
  }, [])

  const doTracker = useCallback(
    (message) => {
      tracker(`内页导航点击 - ${message}`)
    },
    [tracker],
  )

  return (
    <>
      {mergedMenu.map((m) => {
        return (
          <div key={m.title} className={styles['link-section']}>
            <Link
              href={m.path}
              className="leading-[1.8]"
              onClick={() => doTracker(m.title)}
            >
              <div className={styles['parent']}>
                <FontIcon icon={m.icon} />
                <span>{m.title}</span>
              </div>
            </Link>
            <div className={styles['children-wrapper']}>
              {m.subMenu &&
                m.subMenu.map((m) => {
                  return (
                    <Link
                      href={m.path}
                      key={m.title}
                      className="leading-[1.6]"
                      onClick={() => doTracker(m.title)}
                    >
                      <div className={styles['children']}>
                        <FontIcon icon={m.icon} />
                        <span>{m.title}</span>
                      </div>
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
