import classNames from 'clsx'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { Fragment, memo, useEffect } from 'react'

import { CloseIcon } from '@mx-space/kami-design/components/Icons/layout'
import { Overlay } from '@mx-space/kami-design/components/Overlay'
import { RootPortal } from '@mx-space/kami-design/components/Portal'

import { IF } from '~/components/app/If'
import { withNoSSR } from '~/components/biz/HoC/no-ssr'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useDetectPadOrMobile } from '~/hooks/use-viewport'

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
          <Overlay show={show} onClose={onExit} zIndex={60} />
          <div
            className={classNames(
              styles['drawer'],
              show ? styles['show'] : null,
            )}
          >
            <div className="pb-4 text-right">
              <span className="p-4 inline-block -mr-5 -mt-4" onClick={onExit}>
                <CloseIcon />
              </span>
            </div>

            {children}
          </div>
        </Fragment>
      </RootPortal>
    )
  },
)
export const HeaderDrawer = IF(withNoSSR(_HeaderDrawer), () =>
  useDetectPadOrMobile(),
)
