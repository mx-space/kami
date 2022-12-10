import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { memo, useRef } from 'react'

import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useOnceClientEffect } from '~/hooks/use-once-client-effect'
import { NoSSRWrapper } from '~/utils/no-ssr'
import { genSpringKeyframes } from '~/utils/spring'

import styles from './index.module.css'

const sakuraSpringNameUp = 'sakura-up'
const sakuraSpringNameDown = 'sakura-down'

export const LampSwitch = NoSSRWrapper(
  memo<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>(
    (props = {}) => {
      const containerRef = useRef<HTMLDivElement>(null)

      useOnceClientEffect(() => {
        genSpringKeyframes(
          sakuraSpringNameDown,
          {
            translateY: '0vh',
          },
          {
            translateY: '10vh',
          },
        )

        genSpringKeyframes(
          sakuraSpringNameUp,
          {
            translateY: '10vh',
          },
          {
            translateY: '0',
          },
        )
      })

      const { event } = useAnalyze()
      return (
        <div
          className={styles['select-container']}
          ref={containerRef}
          data-hide-print
        >
          <div className={styles['select-line']}>
            <div className={styles['line']} />
          </div>
          <div className={styles['sakura-wrap']} {...props}>
            <div
              className={styles['sakura-img']}
              onClick={() => {
                event({
                  action: TrackerAction.Interaction,
                  label: `颜色切换`,
                })
                if (containerRef.current) {
                  // containerRef.current.style.top = '0'
                  containerRef.current.style.animation = `${sakuraSpringNameDown} .5s steps(60) both`
                  containerRef.current.onanimationend = () => {
                    if (containerRef.current) {
                      containerRef.current.style.animation = `${sakuraSpringNameUp} .5s steps(60) both`

                      containerRef.current.onanimationend = () => {
                        containerRef.current!.style.animation = ''
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )
    },
  ),
)
