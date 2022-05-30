import classNames from 'clsx'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { Fragment, memo, useEffect } from 'react'
import { NoSSR } from 'utils'

import { LaTimes } from '~/components/universal/Icons'
import { OverLay } from '~/components/universal/Overlay'
import { RootPortal } from '~/components/universal/Portal'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'

import styles from './index.module.css'

const _HeaderDrawer: FC<{ show: boolean; onExit: () => void }> = memo(
  ({ children, onExit, show }) => {
    const router = useRouter()
    const { event } = useAnalyze()

    useEffect(() => {
      if (show) {
        event({
          action: TrackerAction.Interaction,
          label: '顶部导航被打开了',
        })
      }
    }, [show])

    useEffect(() => {
      const handler = () => {
        onExit()
      }
      router.events.on('routeChangeStart', handler)

      return () => {
        router.events.off('routeChangeStart', handler)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])
    return (
      <RootPortal>
        <Fragment>
          <OverLay show={show} onClose={onExit}></OverLay>
          <div
            className={classNames(
              styles['drawer'],
              show ? styles['show'] : null,
            )}
          >
            <div className="pb-4 text-right">
              <span className={'p-4 inline-block -mr-5 -mt-4'} onClick={onExit}>
                <LaTimes />
              </span>
            </div>

            {children}
          </div>
        </Fragment>
      </RootPortal>
    )
  },
)
export const HeaderDrawer = NoSSR(_HeaderDrawer)
